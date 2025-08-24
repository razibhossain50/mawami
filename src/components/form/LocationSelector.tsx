import { useState, useRef, useEffect } from "react";
import { ChevronLeft, X, ChevronRight, ChevronDown } from "lucide-react";
import { geoLocation } from "../../api/geo-location";
import { addressData } from "../../api/address-data";

type SelectionPath = {
  country?: string;
  division?: string;
  district?: string;
  upazila?: string;
};

type Level = "country" | "division" | "district" | "upazila";

type DataSource = "geoLocation" | "addressData";

type LocationOption = {
  name: string;
  value: string;
  hasChildren: boolean;
};

interface LocationSelectorProps {
  onLocationSelect: (location: string) => void;
  value?: string;
  dataSource?: DataSource;
  type?: "permanent" | "present"; // For addressData compatibility
  data?: Record<string, unknown>; // For addressData compatibility
  errors?: Record<string, string>; // For addressData compatibility
  updateData?: (data: Partial<Record<string, unknown>>) => void; // For addressData compatibility
  id?: string; // For accessibility label association
  "aria-labelledby"?: string; // For accessibility label association
  "aria-label"?: string; // For accessibility label
}

export function LocationSelector({
  onLocationSelect,
  value,
  dataSource = "geoLocation",
  type = "permanent",
  data: formData,
  errors,
  updateData,
  id,
  "aria-labelledby": ariaLabelledBy,
  "aria-label": ariaLabel
}: LocationSelectorProps) {
  const [currentLevel, setCurrentLevel] = useState<Level>("country");
  const [selectionPath, setSelectionPath] = useState<SelectionPath>({});
  const [locationSelection, setLocationSelection] = useState<string>("");
  const [isLocationDropdownOpen, setIsLocationDropdownOpen] = useState(false);

  const locationContainerRef = useRef<HTMLDivElement>(null);

  // Choose data source based on prop
  const sourceData = dataSource === "geoLocation" ? geoLocation[0] : null;

  // For addressData compatibility
  const countryKey = `${type}Country`;
  const divisionKey = `${type}Division`;
  const zillaKey = `${type}Zilla`;
  const upazillaKey = `${type}Upazilla`;

  const selectedCountry = formData?.[countryKey] as string;
  const selectedDivision = formData?.[divisionKey] as string;
  const selectedZilla = formData?.[zillaKey] as string;
  const selectedUpazilla = formData?.[upazillaKey] as string;

  // Sync internal state with external value prop
  useEffect(() => {
    if (value !== undefined) {
      setLocationSelection(value);
    }
  }, [value]);

  // Check if an option has children (should show arrow)
  const hasChildren = (value: string, level: Level) => {
    if (dataSource === "geoLocation") {
      switch (level) {
        case "country":
          return true; // Country always has divisions
        case "division":
          if (value === "All Divisions") return false; // "All Divisions" doesn't have children
          const division = sourceData?.divisions.find((div) => div.name === value);
          return division && division.districts && division.districts.length > 0;
        case "district":
          if (value === "All Districts") return false; // "All Districts" doesn't have children
          const selectedDivision = sourceData?.divisions.find((div) => div.name === selectionPath.division);
          const district = selectedDivision?.districts?.find((dist) => dist.name === value);
          return district && district.upazilas && district.upazilas.length > 0;
        case "upazila":
          if (value === "All Upazilas") return false;
          return false; // Upazilas are the final level, no children
        default:
          return false;
      }
    } else {
      // addressData logic
      switch (level) {
        case "country":
          return true;
        case "division":
          return selectedCountry && addressData[selectedCountry]?.divisions[value];
        case "district":
          return selectedCountry && selectedDivision &&
            addressData[selectedCountry]?.divisions[selectedDivision]?.districts[value];
        case "upazila":
          return false; // Final level
        default:
          return false;
      }
    }
  };

  // Get current location options based on level and selection path
  const getCurrentLocationOptions = (): LocationOption[] => {
    if (dataSource === "geoLocation") {
      switch (currentLevel) {
        case "country":
          return [{ name: sourceData?.country || "", value: sourceData?.country || "", hasChildren: hasChildren(sourceData?.country || "", "country") }];
        case "division":
          return sourceData?.divisions.map((div) => ({
            name: div.name,
            value: div.name,
            hasChildren: hasChildren(div.name, "division")
          })) || [];
        case "district":
          const selectedDivision = sourceData?.divisions.find((div) => div.name === selectionPath.division);
          if (!selectedDivision || !selectedDivision.districts) return [];

          return selectedDivision.districts.map((dist) => ({
            name: dist.name,
            value: dist.name,
            hasChildren: hasChildren(dist.name, "district")
          }));
        case "upazila":
          const division = sourceData?.divisions.find((div) => div.name === selectionPath.division);
          const selectedDistrict = division?.districts?.find((dist) => dist.name === selectionPath.district);
          return selectedDistrict?.upazilas?.map((upazila) => ({
            name: upazila,
            value: upazila,
            hasChildren: false
          })) || [];
        default:
          return [];
      }
    } else {
      // addressData logic
      switch (currentLevel) {
        case "country":
          return Object.keys(addressData).map(code => ({
            name: addressData[code].name,
            value: code,
            hasChildren: hasChildren(code, "country")
          }));
        case "division":
          if (!selectedCountry) return [];
          return Object.keys(addressData[selectedCountry].divisions).map(code => ({
            name: addressData[selectedCountry].divisions[code].name,
            value: code,
            hasChildren: hasChildren(code, "division")
          }));
        case "district":
          if (!selectedCountry || !selectedDivision) return [];
          return Object.keys(addressData[selectedCountry].divisions[selectedDivision].districts).map(code => ({
            name: addressData[selectedCountry].divisions[selectedDivision].districts[code].name,
            value: code,
            hasChildren: hasChildren(code, "district")
          }));
        case "upazila":
          if (!selectedCountry || !selectedDivision || !selectedZilla) return [];
          return addressData[selectedCountry].divisions[selectedDivision].districts[selectedZilla].upazilas.map((name: string) => ({
            name: name,
            value: name,
            hasChildren: false
          }));
        default:
          return [];
      }
    }
  };

  // Handle location selection
  const handleLocationSelection = (value: string, label?: string) => {
    if (dataSource === "geoLocation") {
      const newPath = { ...selectionPath };

      switch (currentLevel) {
        case "country":
          newPath.country = value;
          setSelectionPath(newPath);
          setCurrentLevel("division");
          break;
        case "division":
          if (value === "All Divisions") {
            // Close dropdown and set selection
            const fullPath = `${newPath.country} > All Divisions`;
            setLocationSelection(fullPath);
            onLocationSelect(fullPath);
            setIsLocationDropdownOpen(false);
            return;
          }
          newPath.division = value;
          setSelectionPath(newPath);
          setCurrentLevel("district");
          break;
        case "district":
          if (value === "All Districts") {
            // Close dropdown and set selection
            const fullPath = `${newPath.country} > ${newPath.division} > All Districts`;
            setLocationSelection(fullPath);
            onLocationSelect(fullPath);
            setIsLocationDropdownOpen(false);
            return;
          }
          newPath.district = value;
          setSelectionPath(newPath);
          setCurrentLevel("upazila");
          break;
        case "upazila":
          if (value === "All Upazilas") {
            // Close dropdown and set selection
            const fullPath = `${newPath.country} > ${newPath.division} > ${newPath.district} > All Upazilas`;
            setLocationSelection(fullPath);
            onLocationSelect(fullPath);
            setIsLocationDropdownOpen(false);
            return;
          }
          newPath.upazila = value;
          setSelectionPath(newPath);
          const fullPath = `${newPath.country} > ${newPath.division} > ${newPath.district} > ${value}`;
          setLocationSelection(fullPath);
          onLocationSelect(fullPath);
          setIsLocationDropdownOpen(false);
          break;
      }
    } else {
      // addressData logic - update form data directly
      const updates: Record<string, string> = {};
      const displayLabel = label || value;

      switch (currentLevel) {
        case "country":
          updates[countryKey] = value;
          updates[divisionKey] = "";
          updates[zillaKey] = "";
          updates[upazillaKey] = "";
          setSelectionPath({ country: displayLabel });
          setCurrentLevel("division");
          break;
        case "division":
          updates[divisionKey] = value;
          updates[zillaKey] = "";
          updates[upazillaKey] = "";
          setSelectionPath(prev => ({ ...prev, division: displayLabel }));
          setCurrentLevel("district");
          break;
        case "district":
          updates[zillaKey] = value;
          updates[upazillaKey] = "";
          setSelectionPath(prev => ({ ...prev, district: displayLabel }));
          setCurrentLevel("upazila");
          break;
        case "upazila":
          updates[upazillaKey] = value;
          setSelectionPath(prev => ({ ...prev, upazila: displayLabel }));
          setIsLocationDropdownOpen(false);
          setCurrentLevel("country");
          break;
      }

      if (updateData) {
        updateData(updates);
      }
    }
  };

  // Reset location selection
  const resetLocation = () => {
    setSelectionPath({});
    setLocationSelection("");
    setCurrentLevel("country");
    setIsLocationDropdownOpen(true);

    if (dataSource === "geoLocation") {
      onLocationSelect("");
    } else {
      // Reset addressData form fields
      if (updateData) {
        updateData({
          [countryKey]: "",
          [divisionKey]: "",
          [zillaKey]: "",
          [upazillaKey]: "",
        });
      }
    }
  };

  const handleToggleDropdown = () => {
    setIsLocationDropdownOpen(!isLocationDropdownOpen);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        locationContainerRef.current &&
        !locationContainerRef.current.contains(event.target as Node)
      ) {
        setIsLocationDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Get display value for addressData mode
  const getAddressDataDisplayValue = () => {
    if (!formData) return "";

    const parts = [];
    if (selectedCountry) parts.push(addressData[selectedCountry]?.name);
    if (selectedDivision) parts.push(addressData[selectedCountry]?.divisions[selectedDivision]?.name);
    if (selectedZilla) parts.push(addressData[selectedCountry]?.divisions[selectedDivision]?.districts[selectedZilla]?.name);
    if (selectedUpazilla) parts.push(selectedUpazilla);

    return parts.length > 0 ? parts.join(' > ') : '';
  };

  // Handle breadcrumb click for addressData
  const handleAddressDataBreadcrumbClick = (index: number) => {
    const levels = ['country', 'division', 'district', 'upazila'];
    const nextLevel = levels[index + 1] as Level;
    setCurrentLevel(nextLevel || 'country');
  };

  const levelTitles = {
    country: "Select Country",
    division: "Select Division",
    district: "Select District",
    upazila: "Select Upazila",
  };

  // Get display value for both data sources
  const getDisplayValue = () => {
    if (dataSource === "addressData") {
      return getAddressDataDisplayValue();
    }

    // For geoLocation, build display value from current selection path
    if (locationSelection) {
      return locationSelection;
    }

    // Build partial path for geoLocation based on current selections
    const parts = [];
    if (selectionPath.country) parts.push(selectionPath.country);
    if (selectionPath.division) parts.push(selectionPath.division);
    if (selectionPath.district) parts.push(selectionPath.district);
    if (selectionPath.upazila) parts.push(selectionPath.upazila);

    return parts.length > 0 ? parts.join(' > ') : '';
  };

  // Get breadcrumb items for both data sources
  const getBreadcrumbItems = () => {
    if (dataSource === "addressData") {
      const breadcrumbItems = [];
      if (selectedCountry) breadcrumbItems.push({ level: 'country', value: selectedCountry, label: addressData[selectedCountry]?.name });
      if (selectedDivision) breadcrumbItems.push({ level: 'division', value: selectedDivision, label: addressData[selectedCountry]?.divisions[selectedDivision]?.name });
      if (selectedZilla) breadcrumbItems.push({ level: 'district', value: selectedZilla, label: addressData[selectedCountry]?.divisions[selectedDivision]?.districts[selectedZilla]?.name });
      return breadcrumbItems;
    }
    return [];
  };

  const displayValue = getDisplayValue();
  const breadcrumbItems = getBreadcrumbItems();

  return (
    <div className="relative" ref={locationContainerRef}>
      <div
        className="w-full px-3 py-[10px] rounded-[14px] h-16 bg-[#f4f4f5] cursor-pointer hover:bg-muted/50 transition-colors"
        onClick={handleToggleDropdown}
        id={id}
        role="button"
        tabIndex={0}
        {...(ariaLabelledBy ? { "aria-labelledby": ariaLabelledBy } : ariaLabel ? { "aria-label": ariaLabel } : { "aria-label": "Select location" })}
        aria-expanded={isLocationDropdownOpen}
        aria-haspopup="listbox"
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleToggleDropdown();
          }
        }}
      >
        <div className="text-[13px] text-foreground-500">Select Your Location</div>
        <div className="flex items-center justify-between text-foreground-500">
          <span className={`text-md truncate pr-2`}>
            {displayValue || "Select location"}
          </span>
          {displayValue ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                resetLocation();
              }}
              className="p-1 hover:bg-muted-foreground/20 rounded-full transition-colors flex-shrink-0"
              aria-label="Clear selection"
            >
              <X className="w-4 h-4" />
            </button>
          ) : (
            <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform flex-shrink-0 ${isLocationDropdownOpen ? 'rotate-180' : ''}`} />
          )}
        </div>
      </div>

      {isLocationDropdownOpen && (
        <div className="absolute left-0 right-0 z-50 mt-1 bg-white border border-gray-200 rounded-md shadow-lg">
          {/* Unified Header for both data sources */}
          {(currentLevel !== "country" || breadcrumbItems.length > 0 || displayValue) && (
            <div className="flex items-center justify-between p-2 border-b border-gray-200">
              {/* Back button - show for both modes when not at country level */}
              {currentLevel !== "country" ? (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    const levels: Level[] = ["country", "division", "district", "upazila"];
                    const currentIndex = levels.indexOf(currentLevel);
                    if (currentIndex > 0) {
                      setCurrentLevel(levels[currentIndex - 1]);
                    }
                  }}
                  className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
                  aria-label="Go back to previous level"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Back
                </button>
              ) : (
                <div></div>
              )}

              {/* Current level title on the right */}
              <span className="text-sm font-medium text-gray-700">{levelTitles[currentLevel]}</span>
            </div>
          )}

          <div className="p-2 max-h-48 overflow-y-auto">
            {getCurrentLocationOptions().map((option) => (
              <button
                key={option.value}
                onClick={(e) => {
                  e.stopPropagation();
                  if (dataSource === "addressData") {
                    handleLocationSelection(option.value, option.name);
                  } else {
                    handleLocationSelection(option.value);
                  }
                }}
                className="w-full p-2 text-left rounded-md hover:bg-muted transition-colors flex items-center justify-between"
              >
                <span className="text-sm">{option.name}</span>
                {option.hasChildren && (
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                )}
              </button>
            ))}
            {getCurrentLocationOptions().length === 0 && (
              <div className="px-3 py-4 text-sm text-gray-500 text-center">
                No options available
              </div>
            )}
          </div>
        </div>
      )}

      {/* Error Display for addressData */}
      {dataSource === "addressData" && errors && (errors[countryKey] || errors[divisionKey] || errors[zillaKey] || errors[upazillaKey]) && (
        <p className="text-sm text-red-500 mt-1">
          {errors[countryKey] || errors[divisionKey] || errors[zillaKey] || errors[upazillaKey]}
        </p>
      )}
    </div>
  );
}