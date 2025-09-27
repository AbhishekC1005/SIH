import { useMemo, useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
// FIX: Reverting to alias import to resolve persistent compilation errors.
import { useAppState } from "@/context/app-state"; 
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Search,
  User,
  Clock,
  Calendar,
  Activity,
  Heart,
  Plus,
  MoreHorizontal,
  RefreshCw,
  Loader2, // For loading spinner
  AlertTriangle // For error icon
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";


// Define the expected structure of a Patient fetched from the API
interface Patient {
  _id: string; // MongoDB ID for the patient
  name: string;
  email: string;
  ayurvedic_category: 'vata' | 'pitta' | 'kapha' | string;
  contact: string;
  createdAt: string;
  // ... other patient fields
}

export default function DoctorPatients() {
  // Removed unused dependency 'requests' and 'fetchRequests' if not used for patient data
  const { currentUser } = useAppState(); 
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [patients, setPatients] = useState<Patient[]>([]); // State for fetched patients
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // --- Utility Functions (Local Storage for last viewed) ---
  const doctorProfileId = currentUser?._id; // Use MongoDB ID for doctor ID

  type LastViewedMap = Record<string, number>;
  const lvKey = `app:patients:lastViewed:${doctorProfileId || "anon"}`;
  const readLV = (): LastViewedMap => {
    try {
      return JSON.parse(localStorage.getItem(lvKey) || "{}");
    } catch {
      return {};
    }
  };
  const writeLV = (m: LastViewedMap) =>
    localStorage.setItem(lvKey, JSON.stringify(m));
  const markViewed = (id: string) => {
    const m = readLV();
    m[id] = Date.now();
    writeLV(m);
  };
  // ---------------------------------------------------------------------------------------------

  /**
   * Fetches assigned patients from the backend API.
   * This function needs to be called on page load and whenever a new patient is added/data needs refreshing.
   */
  const fetchAssignedPatients = useCallback(async () => {
    // CRITICAL FIX: Ensure loading state is turned off if doctor is not logged in.
    if (!doctorProfileId) {
      console.warn("User not authenticated or doctor ID missing. Cannot fetch patients.");
      setError("Doctor profile not found. Please log in.");
      setIsLoading(false); 
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      // NOTE: Axios handles this withCredentials automatically; using fetch needs attention to headers/cookies
      const response = await fetch('/api/doctor/patients', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // Authentication (JWT/Cookie) is handled automatically by the browser/setup
        },
      });

      if (!response.ok) {
        // Read the error message from the response body for better debugging
        const errorData = await response.json().catch(() => ({ message: `HTTP Error ${response.status}` }));
        throw new Error(errorData.message || `Failed to fetch assigned patients: Status ${response.status}`);
      }

      const result = await response.json();
      
      // Check for success and expected data structure
      if (result.success && Array.isArray(result.data)) {
        setPatients(result.data);
      } else {
         throw new Error(result.message || "Invalid data structure received from the server (missing 'success' or 'data' array).");
      }

    } catch (err: any) {
      // LOG THE FULL ERROR HERE for debugging in the browser console
      console.error("Error fetching patients:", err); 
      // Fallback error message for network issues or unexpected errors
      setError(err.message || "An unknown network error occurred."); 
    } finally {
      setIsLoading(false);
    }
  }, [doctorProfileId]);

  // Initial fetch on mount and on doctor ID change
  useEffect(() => {
    if (doctorProfileId) {
      fetchAssignedPatients();
    } else {
      // Ensure loading stops even if the user is not authenticated yet
      setIsLoading(false); 
    }
    // ensure lv exists
    if (!localStorage.getItem(lvKey)) writeLV({});
  }, [doctorProfileId, fetchAssignedPatients, lvKey]);

  // --- Stat and Filter Logic uses the fetched `patients` state ---

  // Calculate statistics based on available data
  const stats = useMemo(() => {
    const now = new Date();
    const monthAgo = new Date(now);
    monthAgo.setMonth(monthAgo.getMonth() - 1);

    // Count patients added in the last month
    const recentPatients = patients.filter((p) => {
      // Assuming 'createdAt' is available on the Patient object
      const patientDate = new Date(p.createdAt); 
      return patientDate > monthAgo;
    });

    // Count patients who might need follow-up (using last viewed as a proxy)
    const needsFollowUp = patients.filter((p) => {
      const lastViewed = readLV()[p._id]; // Use _id for API data
      if (!lastViewed) return true; // Never viewed
      const lastViewDate = new Date(lastViewed);
      const weekAgo = new Date(now);
      weekAgo.setDate(weekAgo.getDate() - 7);
      return lastViewDate < weekAgo;
    }).length;

    return {
      total: patients.length,
      recent: recentPatients.length,
      needsFollowUp,
    };
  }, [patients]); 

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const lv = readLV();
    const arr = patients.filter((p) => {
      const name = (p.name || `Patient ${p._id}`).toLowerCase(); // Use p.name and p._id
      return q ? name.includes(q) : true;
    });
    return arr.sort((a, b) => {
      const la = lv[a._id]; // Use _id
      const lb = lv[b._id]; // Use _id
      if (la && lb) return lb - la;
      if (la && !lb) return -1;
      if (!la && lb) return 1;
      const na = (a.name || `Patient ${a._id}`).toLowerCase(); // Use p.name
      const nb = (b.name || `Patient ${b._id}`).toLowerCase(); // Use p.name
      return na.localeCompare(nb);
    });
  }, [query, patients]); 

  // --- Rendering logic ---

  if (isLoading) {
    return (
      <div className="p-6 max-w-7xl mx-auto flex justify-center items-center h-96">
        <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
        <p className="ml-4 text-lg text-gray-600">Loading patients...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <Card className="border-red-400 bg-red-50">
          <CardContent className="p-6 flex items-center">
            <AlertTriangle className="h-6 w-6 text-red-600 mr-4" />
            <div className="flex-1">
              <h3 className="font-semibold text-red-800">Error Loading Data</h3>
              <p className="text-sm text-red-700">{error}</p>
            </div>
            <Button
                variant="outline"
                onClick={fetchAssignedPatients}
                className="ml-4 border-red-400 text-red-700 hover:bg-red-100"
            >
                <RefreshCw className="h-4 w-4 mr-2" /> Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Clean Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
        <div>
          <h1 className="text-2xl font-medium text-gray-900">
            Patients
          </h1>
          <p className="text-gray-600 mt-1">
            Manage and monitor your patients
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              type="search"
              placeholder="Search patients..."
              className="pl-10 w-80 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          {/* Added Refresh button */}
          <Button
            variant="outline"
            className="border-gray-300 text-gray-700 hover:bg-gray-50"
            onClick={fetchAssignedPatients}
            disabled={isLoading}
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button
            className="bg-blue-600 hover:bg-blue-700 text-white"
            onClick={() => navigate("/doctor/patients/add")}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Patient
          </Button>
        </div>
      </div>

      {/* Clean Stats Cards */}
      <div className="grid gap-6 md:grid-cols-3 mb-8">
        <Card className="shadow-sm border-gray-200 hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">
                  Total Patients
                </p>
                <p className="text-3xl font-semibold text-gray-900 mt-2">
                  {stats.total}
                </p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <User className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-4">
              Under your care
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-gray-200 hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">
                  Recent Additions
                </p>
                <p className="text-3xl font-semibold text-gray-900 mt-2">
                  +{stats.recent}
                </p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <Activity className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-4">
              This month
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-gray-200 hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">
                  Follow-up Needed
                </p>
                <p className="text-3xl font-semibold text-gray-900 mt-2">
                  {stats.needsFollowUp}
                </p>
              </div>
              <div className="p-3 bg-orange-50 rounded-lg">
                <Clock className="h-6 w-6 text-orange-600" />
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-4">
              Needs attention
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Clean Patients Table */}
      <Card className="shadow-sm border-gray-200">
        <CardHeader className="border-b border-gray-100 bg-white">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg font-medium text-gray-900">
                Patient Records
              </CardTitle>
              <CardDescription className="text-gray-600 mt-1">
                Manage and view your patients' information
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {filtered.length > 0 ? (
            <>
              {/* Desktop Table View */}
              <div className="hidden md:block">
                <Table>
                  <TableHeader className="bg-gray-50">
                    <TableRow className="border-b border-gray-200">
                      <TableHead className="px-6 py-4 font-medium text-gray-700">
                        Patient
                      </TableHead>
                      <TableHead className="px-4 py-4 font-medium text-gray-700">
                        Date Added
                      </TableHead>
                      <TableHead className="px-4 py-4 font-medium text-gray-700">
                        Constitution
                      </TableHead>
                      <TableHead className="px-6 py-4 text-right font-medium text-gray-700">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filtered.map((patient) => (
                      <TableRow key={patient._id} className="hover:bg-gray-50 transition-colors border-b border-gray-100">
                        <TableCell className="px-6 py-4">
                          <div className="flex items-center space-x-3">
                            <Avatar className="h-10 w-10">
                              <AvatarFallback className="bg-gray-100 text-gray-700 font-medium">
                                {patient.name
                                  ?.split(" ")
                                  .map((n) => n[0])
                                  .join("")
                                  .toUpperCase() || "P"}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium text-gray-900">
                                {patient.name || `Patient ${patient._id}`}
                              </div>
                              <div className="text-sm text-gray-500 flex items-center">
                                <Heart className="h-3 w-3 mr-1 text-gray-400" />
                                {/* Use ayurvedic_category from API data */}
                                {patient.ayurvedic_category?.toUpperCase() || "N/A"} 
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="px-4 py-4">
                          <div className="flex items-center text-sm text-gray-600">
                            <Calendar className="mr-2 h-4 w-4 text-gray-400" />
                            {new Date(patient.createdAt).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              },
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="px-4 py-4">
                            <Badge 
                                className={`
                                    text-xs font-semibold px-2 py-1 rounded-full
                                    ${
                                        patient.ayurvedic_category === 'vata' ? 'bg-blue-100 text-blue-800' :
                                        patient.ayurvedic_category === 'pitta' ? 'bg-red-100 text-red-800' :
                                        patient.ayurvedic_category === 'kapha' ? 'bg-green-100 text-green-800' :
                                        'bg-gray-100 text-gray-800'
                                    }
                                `}
                            >
                                {patient.ayurvedic_category?.toUpperCase() || "N/A"}
                            </Badge>
                        </TableCell>
                        <TableCell className="px-6 py-4 text-right">
                          <div className="flex justify-end space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-gray-300 text-gray-700 hover:bg-gray-50"
                              onClick={() => {
                                markViewed(patient._id); // Mark viewed
                                navigate(`/doctor/patients/${patient._id}`); // Use _id for navigation
                              }}
                            >
                              View
                            </Button>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 w-8 p-0 text-gray-500 hover:text-gray-700"
                                >
                                  <span className="sr-only">Open menu</span>
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-48">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem onClick={() => navigate(`/doctor/patients/${patient._id}`)}>View Profile</DropdownMenuItem>
                                <DropdownMenuItem>Message</DropdownMenuItem>
                                <DropdownMenuItem>View History</DropdownMenuItem>
                                <DropdownMenuItem className="text-red-600">
                                  Remove
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Mobile Card View */}
              <div className="md:hidden divide-y divide-gray-100">
                {filtered.map((patient) => (
                  <div key={patient._id} className="p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3 flex-1">
                        <Avatar className="h-12 w-12">
                          <AvatarFallback className="bg-gray-100 text-gray-700 font-medium">
                            {patient.name
                              ?.split(" ")
                              .map((n) => n[0])
                              .join("")
                              .toUpperCase() || "P"}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-gray-900 truncate">
                            {patient.name || `Patient ${patient._id}`}
                          </div>
                          <div className="text-sm text-gray-500 flex items-center mt-1">
                            <Heart className="h-3 w-3 mr-1 text-gray-400" />
                            {patient.ayurvedic_category?.toUpperCase() || "N/A"}
                          </div>
                          <div className="text-sm text-gray-500 flex items-center mt-1">
                            <Calendar className="h-3 w-3 mr-1 text-gray-400" />
                            {new Date(patient.createdAt).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 ml-4">
                        <Badge 
                            className={`
                                text-xs font-semibold px-2 py-1 rounded-full
                                ${
                                    patient.ayurvedic_category === 'vata' ? 'bg-blue-100 text-blue-800' :
                                    patient.ayurvedic_category === 'pitta' ? 'bg-red-100 text-red-800' :
                                    patient.ayurvedic_category === 'kapha' ? 'bg-green-100 text-green-800' :
                                    'bg-gray-100 text-gray-800'
                                }
                            `}
                        >
                            {patient.ayurvedic_category?.toUpperCase() || "N/A"}
                        </Badge>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-gray-300 text-gray-700 hover:bg-gray-50"
                          onClick={() => {
                            markViewed(patient._id);
                            navigate(`/doctor/patients/${patient._id}`);
                          }}
                        >
                          View
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="p-12 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                <User className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">No patients found</h3>
              <p className="mt-2 text-sm text-gray-500">
                You currently have no assigned patients in your practice.
              </p>
              <Button
                className="mt-4 bg-blue-600 hover:bg-blue-700 text-white"
                onClick={() => navigate("/doctor/patients/add")}
              >
                Add New Patient
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
