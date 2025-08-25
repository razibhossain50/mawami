"use client";
import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
    Card, CardBody, CardHeader, Button, Select, SelectItem, Input, Chip,
    Pagination, Avatar, Divider
} from "@heroui/react";
import { Search, User, Eye, Heart, Sparkles, Star } from "lucide-react";
import { LocationSelector } from "@/components/form/LocationSelector";
import { useFavorites } from "@/hooks/useFavorites";
import { useRegularAuth } from "@/context/RegularAuthContext";
import { useRouter } from "next/navigation";

interface Biodata {
    id: number;
    fullName: string;
    profilePicture?: string;
    age: number;
    biodataType: string;
    profession: string;
    presentCountry?: string;
    presentDivision?: string;
    presentZilla?: string;
    presentArea?: string;
    permanentArea?: string;
    permanentZilla?: string;
    presentUpazilla?: string;
    permanentUpazilla?: string;
    permanentDivision?: string;
    maritalStatus: string;
    height: string;
    complexion?: string;
    religion?: string;
    educationMedium?: string;
    highestEducation?: string;
}

export const BiodataSearch = () => {
    const [biodatas, setBiodatas] = useState<Biodata[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedGender, setSelectedGender] = useState<string>("");
    const [selectedMaritalStatus, setSelectedMaritalStatus] = useState<string>("");
    const [selectedLocation, setSelectedLocation] = useState<string>("");
    const [biodataNumber, setBiodataNumber] = useState<string>("");
    const [currentPage, setCurrentPage] = useState(1);
    const [hasSearched, setHasSearched] = useState(false);
    const [favoriteStates, setFavoriteStates] = useState<{ [key: number]: boolean }>({});
    const [favoriteLoading, setFavoriteLoading] = useState<{ [key: number]: boolean }>({});

    // Add hooks for authentication and favorites
    const { user, isAuthenticated } = useRegularAuth();
    const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites();
    const router = useRouter();

    const itemsPerPage = 12;

    // Don't fetch biodatas automatically on component mount

    const fetchBiodatas = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/biodatas`);

            if (!response.ok) {
                throw new Error('Failed to fetch biodatas');
            }

            const data = await response.json();
            // Handle both single object and array responses
            const biodatasArray = Array.isArray(data) ? data : [data];
            setBiodatas(biodatasArray);
            setError(null);
        } catch (error) {
            console.error('Error fetching biodatas:', error);
            setError(error instanceof Error ? error.message : 'Failed to load biodatas');
        } finally {
            setLoading(false);
        }
    };

    // Store the search filters that were used for the current results
    const [searchFilters, setSearchFilters] = useState({
        gender: "",
        maritalStatus: "",
        location: "",
        biodataNumber: ""
    });

    // Filter and search logic - only filters when search has been performed
    const filteredBiodatas = useMemo(() => {
        if (!hasSearched) return [];

        console.log('🔍 FILTERING BIODATAS');
        console.log('📊 Total biodatas to filter:', biodatas.length);
        console.log('🎯 Active filters:', searchFilters);

        const filtered = biodatas.filter(biodata => {
            // Gender filter - use the search filters, not current form state
            const matchesGender = !searchFilters.gender || searchFilters.gender === "" || searchFilters.gender === "all" ||
                biodata.biodataType?.toLowerCase() === searchFilters.gender.toLowerCase();

            // Marital status filter - use the search filters, not current form state
            const matchesMaritalStatus = !searchFilters.maritalStatus || searchFilters.maritalStatus === "" || searchFilters.maritalStatus === "all" ||
                biodata.maritalStatus?.toLowerCase() === searchFilters.maritalStatus.toLowerCase();

            // Location filter - use the search filters, not current form state
            const matchesLocation = (() => {
                if (!searchFilters.location || searchFilters.location === '') {
                    console.log('🔍 Location Filter: No location filter applied - showing all');
                    return true; // No location filter applied
                }

                // Parse the hierarchical location string (e.g., "Bangladesh > Dhaka > All Districts")
                const locationParts = searchFilters.location.split(' > ').map(part => part.trim());
                
                console.log('🔍 Location Filter Debug:', {
                    searchLocation: searchFilters.location,
                    locationParts: locationParts,
                    biodataId: biodata.id,
                    biodataLocation: {
                        presentDivision: biodata.presentDivision,
                        permanentDivision: biodata.permanentDivision,
                        presentZilla: biodata.presentZilla,
                        permanentZilla: biodata.permanentZilla,
                        presentUpazilla: biodata.presentUpazilla,
                        permanentUpazilla: biodata.permanentUpazilla,
                        presentArea: biodata.presentArea,
                        permanentArea: biodata.permanentArea
                    }
                });
                
                // If "All Divisions" is selected, show all biodatas from Bangladesh
                if (locationParts.includes('All Divisions')) {
                    console.log('✅ All Divisions selected - showing all biodatas');
                    return true; // Show all biodatas when "All Divisions" is selected
                }
                
                // If "All Districts" is selected, match by division
                if (locationParts.includes('All Districts') && locationParts.length >= 2) {
                    const selectedDivision = locationParts[1]; // Second part is division name
                    const divisionMatch = biodata.presentDivision?.toLowerCase().includes(selectedDivision.toLowerCase()) ||
                           biodata.permanentDivision?.toLowerCase().includes(selectedDivision.toLowerCase());
                    
                    console.log(`🔍 All Districts for division "${selectedDivision}":`, {
                        match: divisionMatch,
                        presentDivision: biodata.presentDivision,
                        permanentDivision: biodata.permanentDivision
                    });
                    
                    return divisionMatch;
                }
                
                // If "All Upazilas" is selected, match by district
                if (locationParts.includes('All Upazilas') && locationParts.length >= 3) {
                    const selectedDistrict = locationParts[2]; // Third part is district name
                    const districtMatch = biodata.presentZilla?.toLowerCase().includes(selectedDistrict.toLowerCase()) ||
                           biodata.permanentZilla?.toLowerCase().includes(selectedDistrict.toLowerCase());
                    
                    console.log(`🔍 All Upazilas for district "${selectedDistrict}":`, {
                        match: districtMatch,
                        presentZilla: biodata.presentZilla,
                        permanentZilla: biodata.permanentZilla
                    });
                    
                    return districtMatch;
                }
                
                // For specific upazila/area selections, be more precise
                if (locationParts.length >= 4) {
                    const selectedDivision = locationParts[1];
                    const selectedDistrict = locationParts[2];
                    const selectedUpazila = locationParts[3];
                    
                    // Check if biodata matches the hierarchical selection
                    const divisionMatch = biodata.presentDivision?.toLowerCase().includes(selectedDivision.toLowerCase()) ||
                                         biodata.permanentDivision?.toLowerCase().includes(selectedDivision.toLowerCase());
                    
                    const districtMatch = biodata.presentZilla?.toLowerCase().includes(selectedDistrict.toLowerCase()) ||
                                         biodata.permanentZilla?.toLowerCase().includes(selectedDistrict.toLowerCase());
                    
                    const upazilaMatch = biodata.presentUpazilla?.toLowerCase().includes(selectedUpazila.toLowerCase()) ||
                                        biodata.permanentUpazilla?.toLowerCase().includes(selectedUpazila.toLowerCase()) ||
                                        biodata.presentArea?.toLowerCase().includes(selectedUpazila.toLowerCase()) ||
                                        biodata.permanentArea?.toLowerCase().includes(selectedUpazila.toLowerCase());
                    
                    const hierarchicalMatch = divisionMatch && districtMatch && upazilaMatch;
                    
                    console.log(`🔍 Specific location "${selectedUpazila}" in "${selectedDistrict}", "${selectedDivision}":`, {
                        hierarchicalMatch,
                        divisionMatch,
                        districtMatch,
                        upazilaMatch,
                        selectedDivision,
                        selectedDistrict,
                        selectedUpazila
                    });
                    
                    return hierarchicalMatch;
                }
                
                // For less specific selections (3 parts or less), do broader matching
                const searchTerm = searchFilters.location.toLowerCase();
                const broadMatch = biodata.presentArea?.toLowerCase().includes(searchTerm) ||
                       biodata.permanentArea?.toLowerCase().includes(searchTerm) ||
                       biodata.presentZilla?.toLowerCase().includes(searchTerm) ||
                       biodata.permanentZilla?.toLowerCase().includes(searchTerm) ||
                       biodata.presentUpazilla?.toLowerCase().includes(searchTerm) ||
                       biodata.permanentUpazilla?.toLowerCase().includes(searchTerm) ||
                       biodata.presentDivision?.toLowerCase().includes(searchTerm) ||
                       biodata.permanentDivision?.toLowerCase().includes(searchTerm) ||
                       // Also check individual parts of the hierarchical selection
                       locationParts.some(part => 
                           part !== 'Bangladesh' && // Skip country name
                           (biodata.presentArea?.toLowerCase().includes(part.toLowerCase()) ||
                           biodata.permanentArea?.toLowerCase().includes(part.toLowerCase()) ||
                           biodata.presentZilla?.toLowerCase().includes(part.toLowerCase()) ||
                           biodata.permanentZilla?.toLowerCase().includes(part.toLowerCase()) ||
                           biodata.presentUpazilla?.toLowerCase().includes(part.toLowerCase()) ||
                           biodata.permanentUpazilla?.toLowerCase().includes(part.toLowerCase()) ||
                           biodata.presentDivision?.toLowerCase().includes(part.toLowerCase()) ||
                           biodata.permanentDivision?.toLowerCase().includes(part.toLowerCase()))
                       );
                
                console.log('🔍 Broad location match:', {
                    match: broadMatch,
                    searchTerm,
                    locationParts: locationParts.filter(part => part !== 'Bangladesh')
                });
                
                return broadMatch;
            })();

            // Biodata number filter - use the search filters, not current form state
            const matchesBiodataNumber = !searchFilters.biodataNumber || searchFilters.biodataNumber === '' ||
                biodata.id.toString().includes(searchFilters.biodataNumber);

            const finalMatch = matchesGender && matchesMaritalStatus && matchesLocation && matchesBiodataNumber;
            
            console.log(`🎯 Biodata ${biodata.id} Filter Results:`, {
                gender: matchesGender,
                maritalStatus: matchesMaritalStatus,
                location: matchesLocation,
                biodataNumber: matchesBiodataNumber,
                finalMatch: finalMatch
            });
            
            return finalMatch;
        });
        
        console.log('✅ FILTERING COMPLETE');
        console.log('📈 Results:', {
            totalBiodatas: biodatas.length,
            filteredCount: filtered.length,
            filterEfficiency: `${((filtered.length / biodatas.length) * 100).toFixed(1)}%`
        });
        
        return filtered;
    }, [biodatas, searchFilters, hasSearched]);

    // Pagination logic
    const totalPages = Math.ceil(filteredBiodatas.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentBiodatas = filteredBiodatas.slice(startIndex, endIndex);

    // Check favorite status for each biodata when they load
    useEffect(() => {
        const checkFavoriteStatuses = async () => {
            if (!isAuthenticated || !user || currentBiodatas.length === 0) return;

            const statuses: { [key: number]: boolean } = {};
            for (const biodata of currentBiodatas) {
                try {
                    const status = await isFavorite(biodata.id);
                    statuses[biodata.id] = status;
                } catch (error) {
                    console.error(`Error checking favorite status for biodata ${biodata.id}:`, error);
                    statuses[biodata.id] = false;
                }
            }
            setFavoriteStates(statuses);
        };

        checkFavoriteStatuses();
    }, [currentBiodatas, isAuthenticated, user, isFavorite]);

    // Handle favorite toggle with backend integration
    const handleFavoriteToggle = async (biodataId: number) => {
        if (!isAuthenticated || !user) {
            router.push('/auth/login');
            return;
        }

        try {
            setFavoriteLoading(prev => ({ ...prev, [biodataId]: true }));

            const isCurrentlyFavorite = favoriteStates[biodataId] || false;

            if (isCurrentlyFavorite) {
                const success = await removeFromFavorites(biodataId);
                if (success) {
                    setFavoriteStates(prev => ({ ...prev, [biodataId]: false }));
                }
            } else {
                const success = await addToFavorites(biodataId);
                if (success) {
                    setFavoriteStates(prev => ({ ...prev, [biodataId]: true }));
                }
            }
        } catch (error) {
            console.error('Error toggling favorite:', error);
        } finally {
            setFavoriteLoading(prev => ({ ...prev, [biodataId]: false }));
        }
    };

    // Reset pagination when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [filteredBiodatas]);

    const handleSearch = async () => {
        // Capture current form values as search filters
        const filters = {
            gender: selectedGender,
            maritalStatus: selectedMaritalStatus,
            location: selectedLocation,
            biodataNumber: biodataNumber
        };
        
        console.log('🔍 BIODATA SEARCH STARTED');
        console.log('📋 Search Filters Applied:', filters);
        console.log('📍 Location Selection Details:', {
            rawLocation: selectedLocation,
            locationParts: selectedLocation ? selectedLocation.split(' > ').map(part => part.trim()) : [],
            hasAllDivisions: selectedLocation?.includes('All Divisions'),
            hasAllDistricts: selectedLocation?.includes('All Districts'),
            hasAllUpazilas: selectedLocation?.includes('All Upazilas')
        });
        
        setSearchFilters(filters);
        setHasSearched(true);
        await fetchBiodatas();
    };


    return (
        <div className="space-y-8 pt-20 bg-[url('/images/hero-bg.png')] bg-no-repeat bg-center bg-cover">
            <div className="container max-w-7xl mx-auto py-24 space-y-8">
                {/* Enhanced Header */}
                <div className="text-center space-y-5 pb-12">
                    <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-rose-600 to-purple-600 bg-clip-text text-transparent">
                        <div className="flex items-center justify-center gap-2">
                            <Sparkles className="h-6 w-6 text-rose-500" aria-hidden="true" />
                            <div className=" text-gray-800">Finder</div>
                            <Sparkles className="h-6 w-6 text-rose-500" aria-hidden="true" />
                        </div>
                    </h1>
                    <p className="text-gray-600 text-2xl">&quot;Craft your love story with someone who complements your soul and spirit&quot;</p>
                </div>

                {/* Enhanced Search and Filters */}
                <Card className="overflow-visible w-full bg-white/95  border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
                    <CardBody className="p-8 overflow-y-visible">
                        <div className="grid gap-6 md:grid-cols-4">
                            <div className="space-y-2">
                                <Select
                                    id="gender-select"
                                    label="I'm looking for"
                                    aria-label="Select gender preference"
                                    size="lg"
                                    placeholder="Select gender"
                                    selectedKeys={selectedGender ? [selectedGender] : []}
                                    onSelectionChange={(keys) => setSelectedGender(Array.from(keys)[0] as string)}
                                    className="w-full"
                                >
                                    <SelectItem key="all">All</SelectItem>
                                    <SelectItem key="Male">Male</SelectItem>
                                    <SelectItem key="Female">Female</SelectItem>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Select
                                    id="marital-status-select"
                                    label="Marital status"
                                    aria-label="Select marital status preference"
                                    size="lg"
                                    placeholder="Select marital status"
                                    selectedKeys={selectedMaritalStatus ? [selectedMaritalStatus] : []}
                                    onSelectionChange={(keys) => setSelectedMaritalStatus(Array.from(keys)[0] as string)}
                                    className="w-full"
                                >
                                    <SelectItem key="all">All</SelectItem>
                                    <SelectItem key="Unmarried">Unmarried</SelectItem>
                                    <SelectItem key="Married">Married</SelectItem>
                                    <SelectItem key="Divorced">Divorced</SelectItem>
                                    <SelectItem key="Widow">Widow</SelectItem>
                                    <SelectItem key="Widower">Widower</SelectItem>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <LocationSelector id="location-select" aria-label="Select location preference" onLocationSelect={setSelectedLocation} value={selectedLocation} />
                            </div>

                            <div className="space-y-2">
                                <Input
                                    id="biodata-number-input"
                                    label="Biodata Number"
                                    aria-label="Enter biodata number to search"
                                    size="lg"
                                    placeholder="Enter biodata number"
                                    value={biodataNumber}
                                    onChange={(e) => setBiodataNumber(e.target.value)}
                                    className="w-full"
                                />
                            </div>
                        </div>

                        <Button
                            className="w-full mt-8 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
                            size="lg"
                            onPress={handleSearch}
                            startContent={<Search className="h-5 w-5" />}
                            isLoading={loading}
                        >
                            Find Your Partner
                        </Button>
                    </CardBody>
                </Card>

                {/* Enhanced Biodatas Grid */}
                {!hasSearched ? (
                    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
                        <CardBody className="text-center py-16">
                            <div className="relative">
                                {/* Decorative background */}
                                <div className="absolute inset-0 opacity-5">
                                    <div className="absolute top-4 left-4 text-4xl">💕</div>
                                    <div className="absolute top-8 right-8 text-3xl">✨</div>
                                    <div className="absolute bottom-4 left-8 text-3xl">💑</div>
                                    <div className="absolute bottom-8 right-4 text-4xl">🌟</div>
                                </div>

                                <div className="relative z-10">
                                    <div className="w-24 h-24 bg-gradient-to-br from-rose-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                                        <Search className="h-12 w-12 text-rose-500" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-gray-900 mb-3">Ready to Find Your Perfect Match?</h3>
                                    <p className="text-gray-600 mb-6 max-w-md mx-auto leading-relaxed">
                                        Use the filters above to search for your ideal partner. Set your preferences and click &quot;Find Your Partner&quot; to discover amazing profiles.
                                    </p>
                                </div>
                            </div>
                        </CardBody>
                    </Card>
                ) : loading ? (
                    <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-xl p-8 space-y-6">
                        {/* Loading Header */}
                        <div className="text-center">
                            <div className="flex items-center justify-center gap-2 mb-4">
                                <Sparkles className="h-5 w-5 text-rose-500 animate-pulse" aria-hidden="true" />
                                <h2 className="text-xl font-semibold text-gray-800">Finding Perfect Matches</h2>
                                <Sparkles className="h-5 w-5 text-rose-500 animate-pulse" aria-hidden="true" />
                            </div>
                            <p className="text-gray-600 animate-pulse">Please wait while we search for your ideal partner...</p>
                        </div>

                        {/* Skeleton Cards Grid - Matching actual card design */}
                        <div className="grid gap-4 md:gap-8 md:grid-cols-3">
                            {[1, 2, 3, 4, 5, 6].map((i) => (
                                <Card key={i} className="bg-white/80 backdrop-blur-sm border-0 shadow-lg overflow-hidden animate-pulse">
                                    {/* Skeleton Header */}
                                    <CardHeader className="bg-gradient-to-r from-gray-200 to-gray-300 pb-2 relative">
                                        <div className="flex justify-between items-start w-full">
                                            <div className="h-6 bg-gray-300 rounded-full w-20"></div>
                                            <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
                                        </div>
                                    </CardHeader>

                                    <CardBody className="space-y-3 md:space-y-6 p-3 md:p-4">
                                        {/* Skeleton Profile Section */}
                                        <div className="grid grid-cols-24">
                                            <div className="col-span-6 flex justify-center">
                                                <div className="w-24 h-24 bg-gray-200 rounded-full border-4 border-white shadow-lg"></div>
                                            </div>
                                            <div className="col-span-18 space-y-2 px-3">
                                                <div className="h-5 bg-gray-200 rounded w-3/4"></div>
                                                <div className="h-4 bg-gray-200 rounded w-full"></div>
                                                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                                            </div>
                                        </div>

                                        {/* Skeleton Divider */}
                                        <div className="h-px bg-gray-200 w-full"></div>

                                        {/* Skeleton Button */}
                                        <div className="h-10 bg-gray-200 rounded-lg w-full"></div>
                                    </CardBody>
                                </Card>
                            ))}
                        </div>
                    </div>
                ) : currentBiodatas.length > 0 ? (
                    <div className="grid gap-4 md:gap-8 md:grid-cols-3">
                        {currentBiodatas.map((biodata) => (
                            <Card key={biodata.id} className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 group overflow-hidden">
                                {/* Card Header with Gradient */}
                                <CardHeader className="bg-gradient-to-r from-rose-400 to-pink-500 text-white pb-2 relative">
                                    <div className="absolute top-2 right-2 opacity-20">
                                        <Sparkles className="h-4 w-4 text-rose-500 animate-pulse" aria-hidden="true" />
                                    </div>
                                    <div className="flex justify-between items-start w-full">
                                        <Chip
                                            color={biodata.biodataType?.toLowerCase() === "male" ? "primary" : "secondary"}
                                            variant="flat"
                                            size="sm"
                                            className="bg-white/90 backdrop-blur-sm"
                                            startContent={<Star className="h-3 w-3" />}
                                        >
                                            BD ID - {biodata.id}
                                        </Chip>
                                        <Button
                                            isIconOnly
                                            variant="ghost"
                                            size="sm"
                                            onPress={() => handleFavoriteToggle(biodata.id)}
                                            isLoading={favoriteLoading[biodata.id]}
                                            disabled={favoriteLoading[biodata.id]}
                                            className={`${favoriteStates[biodata.id] ? "bg-white/90" : "bg-white/90 text-gray-400 hover:text-red-500"} transition-all duration-200`}
                                            aria-label={favoriteStates[biodata.id] ? `Remove ${biodata.fullName} from favorites` : `Add ${biodata.fullName} to favorites`}
                                        >
                                            <Heart
                                                className={`h-4 w-4 ${favoriteStates[biodata.id] ? "fill-rose-500 stroke-rose-500" : ""} group-hover:scale-110 transition-transform`}
                                            />
                                        </Button>
                                    </div>
                                </CardHeader>

                                <CardBody className="space-y-3 md:space-y-6 p-3 md:p-4">
                                    {/* Enhanced Profile Avatar */}
                                    <div className="grid grid-cols-24">
                                        <div className="col-span-6 flex justify-center">
                                            <div className="relative">
                                                {
                                                    biodata.biodataType == "Male" ? (
                                                        <Avatar
                                                            src={biodata.profilePicture ? 
                                                                `${process.env.NEXT_PUBLIC_API_BASE_URL}${biodata.profilePicture}` : 
                                                                "icons/male.png"}
                                                            name={biodata.fullName}
                                                            size="lg"
                                                            className="w-fit h-fit border-4 border-white shadow-lg group-hover:scale-105 transition-transform duration-300"
                                                            alt={`Profile picture of ${biodata.fullName}`}
                                                        />

                                                    ) : (
                                                        <Avatar
                                                            src={biodata.profilePicture ? 
                                                                `${process.env.NEXT_PUBLIC_API_BASE_URL}${biodata.profilePicture}` : 
                                                                "icons/female.png"}
                                                            name={biodata.fullName}
                                                            size="lg"
                                                            className="w-24 h-24 border-4 border-white shadow-lg group-hover:scale-105 transition-transform duration-300"
                                                            alt={`Profile picture of ${biodata.fullName}`}
                                                        />
                                                    )
                                                }
                                            </div>
                                        </div>

                                        {/* Enhanced Profile Info */}
                                        <div className="col-span-18 space-y-1 px-3">
                                            <div className=" text-lg text-gray-900 group-hover:text-rose-600 transition-colors duration-200">
                                                <span className="font-bold">Age: </span>{biodata.age || "Unknown User"}
                                            </div>
                                            <div className="flex items-center  gap-2 bg-gray-50 rounded-full">
                                                <span className="truncate font-medium">
                                                    <span className="font-bold">Height: </span>{biodata.height || "Unknown"}
                                                </span>
                                            </div>
                                            {
                                                biodata.biodataType == "male" ? (
                                                    <div className="flex items-center  gap-2 bg-gray-50 rounded-full">
                                                        <span className="truncate font-medium">
                                                            <span className="font-bold">Complexion: </span>{biodata.complexion || "Unknown"}
                                                        </span>
                                                    </div>

                                                ) : (
                                                    <div className="flex items-center  gap-2 bg-gray-50 rounded-full">
                                                        <span className="font-bold">Profession: </span><span className="truncate font-medium">{biodata.profession}</span>
                                                    </div>

                                                )
                                            }
                                        </div>

                                    </div>

                                    <Divider className="bg-gradient-to-r from-transparent via-gray-200 to-transparent" />

                                    {/* Enhanced View Profile Button */}
                                    <Button
                                        as={Link}
                                        href={`/profile/biodatas/${biodata.id}`}
                                        className="w-full bg-white border-1 text-rose-500 border-rose-500 hover:from-rose-600 hover:to-pink-600 font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                                        size="md"
                                        startContent={<Eye className="h-4 w-4" />}
                                    >
                                        View Full Profile
                                    </Button>
                                </CardBody>
                            </Card>
                        ))}
                    </div>
                ) : (
                                <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
                                    <CardBody className="text-center py-16">
                                        <div className="relative">
                                            {/* Decorative background */}
                                            <div className="absolute inset-0 opacity-5">
                                                <div className="absolute top-4 left-4 text-4xl">💕</div>
                                                <div className="absolute top-8 right-8 text-3xl">✨</div>
                                                <div className="absolute bottom-4 left-8 text-3xl">💑</div>
                                                <div className="absolute bottom-8 right-4 text-4xl">🌟</div>
                                            </div>
                                            {!error ? (
                                                <div className="relative z-10">
                                                    <div className="w-24 h-24 bg-gradient-to-br from-rose-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                                                        <User className="h-12 w-12 text-rose-500" />
                                                    </div>
                                                    <h3 className="text-2xl font-bold text-gray-900 mb-3">No Perfect Matches Found</h3>
                                                    <p className="text-gray-600 mb-6 max-w-md mx-auto leading-relaxed">
                                                        Don&apos;t worry! Your soulmate might be just around the corner. Try adjusting your search filters or check back later for new profiles.
                                                    </p>

                                                    <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
                                                        <Button
                                                            className="bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                                                            onPress={() => {
                                                                setSelectedGender("");
                                                                setSelectedMaritalStatus("");
                                                                setSelectedLocation("");
                                                                setBiodataNumber("");
                                                            }}
                                                            startContent={<Search className="h-4 w-4" />}
                                                        >
                                                            Clear All Filters
                                                        </Button>
                                                        <Button
                                                            variant="flat"
                                                            className="bg-rose-50 text-rose-600 hover:bg-rose-100 border-rose-200"
                                                            onPress={fetchBiodatas}
                                                            startContent={<Sparkles className="h-4 w-4" />}
                                                        >
                                                            Refresh Profiles
                                                        </Button>
                                                    </div>
                                                </div>

                                            ) : (
                                                    <div className="space-y-8">
                                                        <div className="text-center space-y-4">
                                                            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-rose-600 to-purple-600 bg-clip-text text-transparent">
                                                                All Biodatas
                                                            </h1>
                                                            <p className="text-gray-600 text-lg">Discover and connect with verified profiles</p>
                                                        </div>
                                                        <div className="text-center">
                                                            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                                                <User className="h-8 w-8 text-red-500" />
                                                            </div>
                                                            <h3 className="text-xl font-semibold text-gray-900 mb-2">Oops! Something went wrong</h3>
                                                            <p className="text-red-600 mb-6">{error}</p>
                                                            <Button
                                                                color="primary"
                                                                onPress={() => window.location.reload()}
                                                                className="bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600"
                                                            >
                                                                Try Again
                                                            </Button>
                                                        </div>
                                                    </div>
                                            )
                                            }
                                        </div>
                                    </CardBody>
                                </Card>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex justify-center">
                        <Pagination
                            total={totalPages}
                            page={currentPage}
                            onChange={setCurrentPage}
                            showControls
                            showShadow
                            color="secondary"
                        />
                    </div>
                )}

                {/* Results Summary */}
                {filteredBiodatas.length > 0 && (
                    <div className="text-center text-sm text-gray-600">
                        Showing {startIndex + 1}-{Math.min(endIndex, filteredBiodatas.length)} of {filteredBiodatas.length} profiles
                    </div>
                )}

            </div>
        </div>
    );
};