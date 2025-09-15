import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAppState } from "@/context/app-state";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { 
  User, HeartPulse, Stethoscope, 
  ArrowLeft, Activity, Smartphone, Home, AlertCircle
} from "lucide-react";
import { 
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer 
} from 'recharts';

// Type Definitions
interface Meal {
  time: string;
  name: string;
  calories: number;
  waterMl: number;
  type?: string;
  protein?: number;
  carbs?: number;
  fat?: number;
  dosha?: string;
  rasa?: string;
  properties?: string[];
}

interface DayPlan {
  date: string;
  meals: Meal[];
}

interface WeeklyPlan {
  days: DayPlan[];
}

interface PatientProfile {
  id: string;
  name: string;
  age?: number;
  gender?: string;
  dosha?: string;
  height?: number;
  weight?: number;
  phone?: string;
  address?: string;
  emergencyContact?: string;
  medicalHistory?: string;
  allergies?: string;
  medications?: string;
  lifestyle?: string;
  sleepPattern?: string;
  habits?: string;
  dob?: string | Date;
}

interface Request {
  id: string;
  userId: string;
  patientName?: string;
  patientDosha?: string;
  status: string;
  patientProfile?: PatientProfile;
}

export default function DoctorPatientView() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { requests } = useAppState();
  const [activeTab, setActiveTab] = useState("overview");
  const [weekly, setWeekly] = useState<WeeklyPlan | null>(null);
  const [detail, setDetail] = useState<{ di: number; mi: number } | null>(null);

  // Find the current request
  const req = useMemo(() => requests.find((r) => r.id === id), [requests, id]);
  
  // Normalize patient profile
  const profile = useMemo<PatientProfile | null>(() => {
    if (!req?.patientProfile) return null;
    
    const p = { ...req.patientProfile };
    
    // Calculate age from DOB if available
    if (p.dob) {
      try {
        const dob = new Date(p.dob);
        if (!isNaN(dob.getTime())) {
          const today = new Date();
          let age = today.getFullYear() - dob.getFullYear();
          const m = today.getMonth() - dob.getMonth();
          if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) age--;
          p.age = age;
        }
      } catch (e) {
        console.error('Error calculating age:', e);
      }
    }
    
    return p;
  }, [req]);

  if (!req || !profile) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <h2 className="text-2xl font-bold text-muted-foreground">Patient not found</h2>
          <Button className="mt-4" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4 mr-2" /> Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <Button 
        variant="outline" 
        onClick={() => navigate(-1)} 
        className="mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-2" /> Back to Patients
      </Button>
      
      <div className="grid gap-6">
        {/* Patient Header */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold">{profile.name}</h1>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="border-primary/20 bg-primary/5 text-primary">
                        {profile.dosha || 'No Dosha Data'}
                      </Badge>
                      {profile.gender && (
                        <Badge variant="secondary">{profile.gender}</Badge>
                      )}
                      {profile.age && (
                        <span className="text-sm text-muted-foreground">
                          {profile.age} years
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Activity className="h-4 w-4 mr-2" />
                  View Activity
                </Button>
                <Button size="sm">
                  <Stethoscope className="h-4 w-4 mr-2" />
                  New Consultation
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="space-y-6 lg:col-span-2">
            {/* Health Stats */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <HeartPulse className="h-5 w-5 text-rose-500" />
                  <CardTitle className="text-lg">Health Stats</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Height</span>
                      <span className="font-medium">
                        {profile.height ? `${profile.height} cm` : '--'}
                      </span>
                    </div>
                    <Progress 
                      value={profile.height ? Math.min(100, (profile.height / 200) * 100) : 0} 
                      className="h-2" 
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Weight</span>
                      <span className="font-medium">
                        {profile.weight ? `${profile.weight} kg` : '--'}
                      </span>
                    </div>
                    <Progress 
                      value={profile.weight ? Math.min(100, (profile.weight / 150) * 100) : 0} 
                      className="h-2" 
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">BMI</span>
                      <span className="font-medium">
                        {profile.height && profile.weight 
                          ? (profile.weight / ((profile.height/100) ** 2)).toFixed(1)
                          : '--'}
                      </span>
                    </div>
                    <Progress 
                      value={
                        profile.height && profile.weight 
                          ? Math.min(100, (profile.weight / ((profile.height/100) ** 2)) * 3.33)
                          : 0
                      } 
                      className="h-2" 
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Medical Information */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Stethoscope className="h-5 w-5 text-blue-500" />
                  <CardTitle className="text-lg">Medical Information</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-2">Medical History</h4>
                  <p className="text-sm">
                    {profile.medicalHistory || 'No medical history provided'}
                  </p>
                </div>
                <Separator />
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-2">Allergies</h4>
                  <div className="flex flex-wrap gap-2">
                    {profile.allergies ? (
                      profile.allergies.split(',').map((allergy, i) => (
                        <Badge key={i} variant="outline" className="text-amber-700 bg-amber-50 border-amber-100">
                          {allergy.trim()}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-sm text-muted-foreground">No known allergies</span>
                    )}
                  </div>
                </div>
                <Separator />
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-2">Current Medications</h4>
                  <p className="text-sm">
                    {profile.medications || 'No current medications'}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Contact Information */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Smartphone className="h-5 w-5 text-blue-500" />
                  <CardTitle className="text-lg">Contact Information</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-full bg-blue-50 dark:bg-blue-900/30">
                    <Smartphone className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Phone</p>
                    <p className="text-sm text-muted-foreground">
                      {profile.phone || 'Not provided'}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-full bg-blue-50 dark:bg-blue-900/30">
                    <Home className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Address</p>
                    <p className="text-sm text-muted-foreground">
                      {profile.address || 'Not provided'}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-full bg-blue-50 dark:bg-blue-900/30">
                    <AlertCircle className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Emergency Contact</p>
                    <p className="text-sm text-muted-foreground">
                      {profile.emergencyContact || 'Not provided'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Lifestyle */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-emerald-500" />
                  <CardTitle className="text-lg">Lifestyle</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">Daily Routine</h4>
                  <p className="text-sm">
                    {profile.lifestyle || 'No information provided'}
                  </p>
                </div>
                <Separator />
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">Sleep Pattern</h4>
                  <p className="text-sm">
                    {profile.sleepPattern || 'No information provided'}
                  </p>
                </div>
                <Separator />
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">Dietary Habits</h4>
                  <p className="text-sm">
                    {profile.habits || 'No information provided'}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
