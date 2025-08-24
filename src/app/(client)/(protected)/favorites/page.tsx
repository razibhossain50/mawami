"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import {
    Card, CardBody, CardHeader, Button, Chip, Avatar, Divider, Input, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Tooltip
} from "@heroui/react";
import { Heart, Eye, Star, Search, Sparkles, User, ArrowLeft, Filter, Copy, Trash2, ExternalLink } from "lucide-react";
import { useRegularAuth } from "@/context/RegularAuthContext";

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
    maritalStatus: string;
    height: string;
    complexion?: string;
    religion?: string;
    educationMedium?: string;
    highestEducation?: string;
    dateAdded?: string;
}

// API response types
interface FavoriteApiResponse {
    biodata: {
        id: number;
        fullName?: string;
        profilePicture?: string;
        age?: number;
        biodataType?: string;
        profession?: string;
        presentCountry?: string;
        presentDivision?: string;
        presentZilla?: string;
        presentArea?: string;
        maritalStatus?: string;
        height?: string;
        complexion?: string;
        religion?: string;
        educationMedium?: string;
        highestEducation?: string;
    };
    createdAt: string;
}

export default function FavoritesPage() {
    const { user, isAuthenticated } = useRegularAuth();
    const [favorites, setFavorites] = useState<Biodata[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredFavorites, setFilteredFavorites] = useState<Biodata[]>([]);

    // Fetch favorites from API
    useEffect(() => {
        const fetchFavorites = async () => {
            if (!isAuthenticated || !user) {
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError(null);

                const token = localStorage.getItem('regular_user_access_token');
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/favorites`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch favorites');
                }

                const data = await response.json();
                const favoritesData = data.data || [];

                // Transform the API response to match our interface
                const transformedFavorites: Biodata[] = favoritesData.map((fav: FavoriteApiResponse) => ({
                    id: fav.biodata.id,
                    fullName: fav.biodata.fullName || "Unknown User",
                    profilePicture: fav.biodata.profilePicture,
                    age: fav.biodata.age || 0,
                    biodataType: fav.biodata.biodataType || "Unknown",
                    profession: fav.biodata.profession || "Unknown",
                    presentDivision: fav.biodata.presentDivision,
                    presentZilla: fav.biodata.presentZilla,
                    presentCountry: fav.biodata.presentCountry,
                    presentArea: fav.biodata.presentArea,
                    maritalStatus: fav.biodata.maritalStatus || "Unknown",
                    height: fav.biodata.height || "Unknown",
                    complexion: fav.biodata.complexion,
                    religion: fav.biodata.religion,
                    educationMedium: fav.biodata.educationMedium,
                    highestEducation: fav.biodata.highestEducation,
                    dateAdded: fav.createdAt
                }));

                setFavorites(transformedFavorites);
                setFilteredFavorites(transformedFavorites);
            } catch (error) {
                console.error('Error fetching favorites:', error);
                setError('Failed to load your favorite profiles');
            } finally {
                setLoading(false);
            }
        };

        fetchFavorites();
    }, [isAuthenticated, user]);

    // Filter favorites based on search query
    useEffect(() => {
        if (!searchQuery.trim()) {
            setFilteredFavorites(favorites);
        } else {
            const filtered = favorites.filter(biodata =>
                biodata.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                biodata.profession.toLowerCase().includes(searchQuery.toLowerCase()) ||
                biodata.presentDivision?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                biodata.biodataType.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setFilteredFavorites(filtered);
        }
    }, [searchQuery, favorites]);

    const removeFavorite = async (id: number) => {
        if (!isAuthenticated || !user) return;

        try {
            const token = localStorage.getItem('regular_user_access_token');
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/favorites/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Failed to remove from favorites');
            }

            // Update local state immediately
            setFavorites(prev => prev.filter(fav => fav.id !== id));
            setFilteredFavorites(prev => prev.filter(fav => fav.id !== id));
        } catch (error) {
            console.error('Error removing from favorites:', error);
            // You can add a toast notification here
        }
    };

    const copyBiodataLink = async (id: number) => {
        const link = `${window.location.origin}/profile/biodatas/${id}`;
        try {
            await navigator.clipboard.writeText(link);
            // You can add a toast notification here
            console.log('Link copied to clipboard');
        } catch (err) {
            console.error('Failed to copy link:', err);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-purple-50">
                <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Header */}
                    <div className="mb-10">
                        <div className="flex items-center gap-4 mb-6">
                            <Button
                                as={Link}
                                href="/dashboard"
                                variant="ghost"
                                size="sm"
                                startContent={<ArrowLeft className="h-4 w-4" />}
                                className="text-slate-600 hover:text-slate-800"
                            >
                                Back to Dashboard
                            </Button>
                        </div>
                        <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-rose-600 to-purple-600 bg-clip-text text-transparent mb-4 leading-tight">
                            Your Favorites
                        </h1>
                        <p className="text-slate-600 text-xl leading-relaxed">Profiles you&apos;ve saved for later</p>
                    </div>

                    {/* Loading State */}
                    <div className="text-center py-20">
                        <div className="relative">
                            <div className="w-16 h-16 mx-auto mb-6 relative">
                                <div className="absolute inset-0 rounded-full border-4 border-rose-200"></div>
                                <div className="absolute inset-0 rounded-full border-4 border-rose-500 border-t-transparent animate-spin"></div>
                            </div>
                            <div className="flex items-center justify-center gap-2 mb-4">
                                <Heart className="h-5 w-5 text-rose-500 animate-pulse" />
                                <h2 className="text-xl font-semibold text-gray-800">Loading Your Favorites</h2>
                                <Heart className="h-5 w-5 text-rose-500 animate-pulse" />
                            </div>
                            <p className="text-gray-600 animate-pulse">Gathering your saved profiles...</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-purple-50">
                <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="text-center py-20">
                        <Card className="max-w-md mx-auto bg-white/80 backdrop-blur-sm border-0 shadow-xl">
                            <CardBody className="text-center p-8">
                                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Heart className="h-8 w-8 text-red-500" />
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
                            </CardBody>
                        </Card>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-purple-50">
            <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-10">
                    <div className="flex items-center gap-4 mb-6">
                        <Button
                            as={Link}
                            href="/dashboard"
                            variant="ghost"
                            size="sm"
                            startContent={<ArrowLeft className="h-4 w-4" />}
                            className="text-slate-600 hover:text-slate-800"
                        >
                            Back to Dashboard
                        </Button>
                    </div>
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                        <div>
                            <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-rose-600 to-purple-600 bg-clip-text text-transparent mb-4 leading-tight">
                                Your Favorites
                            </h1>
                            <p className="text-slate-600 text-xl leading-relaxed">
                                {favorites.length} profile{favorites.length !== 1 ? 's' : ''} saved for later
                            </p>
                        </div>

                        {/* Search Bar */}
                        {favorites.length > 0 && (
                            <div className="w-full lg:w-96">
                                <Input
                                    size="lg"
                                    placeholder="Search your favorites..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    startContent={<Search className="h-5 w-5 text-slate-400" />}
                                    className="bg-white/80 backdrop-blur-sm"
                                />
                            </div>
                        )}
                    </div>
                </div>

                {/* Favorites List Table */}
                {filteredFavorites.length > 0 ? (
                    <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl">
                        <CardBody className="p-0">
                            <Table
                                aria-label="Favorites table"
                                className="min-h-[400px]"
                                removeWrapper
                            >
                                <TableHeader>
                                    <TableColumn className="bg-gradient-to-r from-rose-500 to-pink-500 text-white font-bold text-center">
                                        SL
                                    </TableColumn>
                                    <TableColumn className="bg-gradient-to-r from-rose-500 to-pink-500 text-white font-bold">
                                        PROFILE
                                    </TableColumn>
                                    <TableColumn className="bg-gradient-to-r from-rose-500 to-pink-500 text-white font-bold text-center">
                                        BIODATA NO.
                                    </TableColumn>
                                    <TableColumn className="bg-gradient-to-r from-rose-500 to-pink-500 text-white font-bold">
                                        DETAILS
                                    </TableColumn>
                                    <TableColumn className="bg-gradient-to-r from-rose-500 to-pink-500 text-white font-bold">
                                        LOCATION
                                    </TableColumn>
                                    <TableColumn className="bg-gradient-to-r from-rose-500 to-pink-500 text-white font-bold text-center">
                                        DATE ADDED
                                    </TableColumn>
                                    <TableColumn className="bg-gradient-to-r from-rose-500 to-pink-500 text-white font-bold text-center">
                                        ACTIONS
                                    </TableColumn>
                                </TableHeader>
                                <TableBody>
                                    {filteredFavorites.map((biodata, index) => (
                                        <TableRow key={biodata.id} className="hover:bg-rose-50/50 transition-colors">
                                            <TableCell className="text-center font-semibold text-slate-700">
                                                {index + 1}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    <Avatar
                                                        src={biodata.profilePicture ?
                                                            `${process.env.NEXT_PUBLIC_API_BASE_URL}${biodata.profilePicture}` :
                                                            (biodata.biodataType === "Male" ? "/icons/male.png" : "/icons/female.png")}
                                                        name={biodata.fullName}
                                                        size="md"
                                                        className="border-2 border-rose-200"
                                                    />
                                                    <div>
                                                        <p className="font-semibold text-slate-800">{biodata.fullName}</p>
                                                        <p className="text-sm text-slate-600">{biodata.profession}</p>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <Chip
                                                    color={biodata.biodataType?.toLowerCase() === "male" ? "primary" : "secondary"}
                                                    variant="flat"
                                                    size="sm"
                                                    className="font-bold"
                                                >
                                                    {biodata.id}
                                                </Chip>
                                            </TableCell>
                                            <TableCell>
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-xs text-slate-500">Age:</span>
                                                        <span className="text-sm font-medium">{biodata.age}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-xs text-slate-500">Height:</span>
                                                        <span className="text-sm font-medium">{biodata.height}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-xs text-slate-500">Status:</span>
                                                        <span className="text-sm font-medium">{biodata.maritalStatus}</span>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="space-y-1">
                                                    <p className="text-sm font-medium text-slate-800">{biodata.presentDivision}</p>
                                                    <p className="text-xs text-slate-600">{biodata.presentZilla}</p>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <p className="text-sm text-slate-600">
                                                    {biodata.dateAdded ? new Date(biodata.dateAdded).toLocaleDateString() : 'N/A'}
                                                </p>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center justify-center gap-2">
                                                    <Tooltip content="View Profile" placement="top">
                                                        <Button
                                                            as={Link}
                                                            href={`/profile/biodatas/${biodata.id}`}
                                                            isIconOnly
                                                            size="sm"
                                                            variant="flat"
                                                            className="bg-blue-50 text-blue-600 hover:bg-blue-100 border-blue-200"
                                                        >
                                                            <ExternalLink className="h-4 w-4" />
                                                        </Button>
                                                    </Tooltip>
                                                    <Tooltip content="Copy Profile Link" placement="top">
                                                        <Button
                                                            isIconOnly
                                                            size="sm"
                                                            variant="flat"
                                                            onPress={() => copyBiodataLink(biodata.id)}
                                                            className="bg-green-50 text-green-600 hover:bg-green-100 border-green-200"
                                                        >
                                                            <Copy className="h-4 w-4" />
                                                        </Button>
                                                    </Tooltip>
                                                    <Tooltip content="Remove from Favorites" placement="top">
                                                        <Button
                                                            isIconOnly
                                                            size="sm"
                                                            variant="flat"
                                                            onPress={() => removeFavorite(biodata.id)}
                                                            className="bg-red-50 text-red-600 hover:bg-red-100 border-red-200"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </Tooltip>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardBody>
                    </Card>
                ) : favorites.length === 0 ? (
                    /* Empty State */
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
                                        <Heart className="h-12 w-12 text-rose-500" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-gray-900 mb-3">No Favorites Yet</h3>
                                    <p className="text-gray-600 mb-6 max-w-md mx-auto leading-relaxed">
                                        Start exploring profiles and save the ones you like. Your favorite profiles will appear here for easy access.
                                    </p>
                                    <Button
                                        as={Link}
                                        href="/search"
                                        className="bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                                        size="lg"
                                        startContent={<Search className="h-5 w-5" />}
                                    >
                                        Explore Profiles
                                    </Button>
                                </div>
                            </div>
                        </CardBody>
                    </Card>
                ) : (
                    /* No Search Results */
                    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
                        <CardBody className="text-center py-16">
                            <div className="w-24 h-24 bg-gradient-to-br from-rose-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                                <Search className="h-12 w-12 text-rose-500" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-3">No Results Found</h3>
                            <p className="text-gray-600 mb-6 max-w-md mx-auto leading-relaxed">
                                No favorites match your search criteria. Try adjusting your search terms.
                            </p>
                            <Button
                                onPress={() => setSearchQuery("")}
                                variant="flat"
                                className="bg-rose-50 text-rose-600 hover:bg-rose-100 border-rose-200"
                                startContent={<Filter className="h-4 w-4" />}
                            >
                                Clear Search
                            </Button>
                        </CardBody>
                    </Card>
                )}
            </div>
        </div>
    );
}