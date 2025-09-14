import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import { useAppState, ConsultRequest } from '@/context/app-state';

// Sample patient requests data
const sampleRequests: ConsultRequest[] = [
  {
    id: 'req_001',
    patientName: 'Rahul Sharma',
    status: 'pending',
    patientDosha: 'Pitta',
    userId: 'user_001',
    doctorId: 'doc_001',
    createdAt: new Date('2025-09-14T10:30:00').toISOString(),
    patientProfile: {
      id: 'user_001',
      name: 'Rahul Sharma',
      dosha: 'Pitta',
      age: 35,
      gender: 'Male',
      phone: '',
      address: '',
      height: null,
      weight: null,
      lifestyle: '',
      medicalHistory: 'GERD',
      allergies: '',
      conditions: 'Acid Reflux',
      medications: 'Antacids',
      habits: '',
      sleepPattern: '',
      digestion: 'Poor',
      emergencyContact: '',
      notes: 'Patient reports symptoms worsening in the evening',
    },
    plan: []
  },
  {
    id: 'req_002',
    patientName: 'Priya Patel',
    status: 'pending',
    patientDosha: 'Vata',
    userId: 'user_002',
    doctorId: 'doc_001',
    createdAt: new Date('2025-09-13T09:45:00').toISOString(),
    patientProfile: {
      id: 'user_002',
      name: 'Priya Patel',
      dosha: 'Vata',
      age: 28,
      gender: 'Female',
      phone: '',
      address: '',
      height: null,
      weight: null,
      lifestyle: '',
      medicalHistory: 'Anxiety',
      allergies: '',
      conditions: 'Insomnia',
      medications: '',
      habits: '',
      sleepPattern: 'Difficulty falling asleep, restless mind',
      digestion: null,
      emergencyContact: '',
      notes: 'Patient reports difficulty sleeping and dry skin',
    },
    plan: []
  }
];

// Sample active patients data
const sampleActivePatients: ConsultRequest[] = [
  {
    id: 'pat_001',
    patientName: 'Vikram Singh',
    status: 'accepted',
    patientDosha: 'Pitta',
    userId: 'user_003',
    doctorId: 'doc_001',
    createdAt: new Date('2025-08-20T16:45:00').toISOString(),
    patientProfile: {
      id: 'user_003',
      name: 'Vikram Singh',
      dosha: 'Pitta',
      age: 42,
      gender: 'Male',
      phone: '',
      address: '',
      height: null,
      weight: null,
      lifestyle: 'Sedentary',
      medicalHistory: 'GERD',
      allergies: 'Spicy food',
      conditions: 'Acid Reflux',
      medications: 'Antacids',
      habits: 'Eats late at night',
      sleepPattern: 'Difficulty sleeping after meals',
      digestion: 'Poor',
      emergencyContact: '',
      notes: 'Experiencing acid reflux after meals. Recommended dietary changes.',
    },
    plan: [
      { time: '08:00', name: 'Breakfast', calories: 400 },
      { time: '13:00', name: 'Lunch', calories: 600 },
      { time: '20:00', name: 'Dinner', calories: 500 }
    ]
  }
];

export default function NewDoctorDashboard() {
  const { currentUser, requests, setRequests } = useAppState();
  const [selected, setSelected] = useState<string | null>(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const [showAddPatient, setShowAddPatient] = useState(false);

  // Initialize with sample data if no requests exist
  useEffect(() => {
    if (requests.length === 0) {
      // Initialize with sample data for demo purposes
      const initialRequests = [...sampleRequests, ...sampleActivePatients];
      setRequests(initialRequests);
    }
  }, [requests.length, setRequests]);

  // Get pending requests for the current doctor
  const pendingForMe = useMemo(() => {
    return requests.filter(r => r.status === "pending");
  }, [requests]);

  // Get active patients for the current doctor
  const myPatients = useMemo(() => {
    return requests.filter(r => r.status === "accepted");
  }, [requests]);

  // Handle accepting a request
  const handleAccept = (id: string) => {
    const currentRequests = [...requests];
    const requestToAccept = currentRequests.find(req => req.id === id);
    
    if (!requestToAccept) return;
    
    // Create updated request with accepted status
    const updatedRequest: ConsultRequest = {
      ...requestToAccept,
      status: 'accepted',
      // Ensure all required fields are included
      plan: requestToAccept.plan || [],
      createdAt: requestToAccept.createdAt || new Date().toISOString(),
      patientProfile: requestToAccept.patientProfile || {
        id: requestToAccept.userId,
        name: requestToAccept.patientName || 'Unknown',
        dosha: requestToAccept.patientDosha || null,
        age: null,
        gender: null,
        phone: '',
        address: '',
        height: null,
        weight: null,
        lifestyle: '',
        medicalHistory: '',
        allergies: '',
        conditions: '',
        medications: '',
        habits: '',
        sleepPattern: '',
        digestion: null,
        emergencyContact: '',
        notes: ''
      }
    };
    
    // Update the request in the list
    const updatedRequests = currentRequests.map(req => 
      req.id === id ? updatedRequest : req
    );
    
    // Update the state
    setRequests(updatedRequests);
    
    // Show success message
    toast.success('Patient Request Approved', {
      description: `${requestToAccept.patientName} has been added to your patients list.`,
      action: {
        label: 'View',
        onClick: () => handleViewPatient(updatedRequest.id)
      }
    });
  };

  // Handle rejecting a request
  const handleReject = (id: string) => {
    const currentRequests = [...requests];
    const requestToReject = currentRequests.find(req => req.id === id);
    
    if (!requestToReject) return;
    
    const updatedRequests = currentRequests.filter(request => request.id !== id);
    
    // Update the state first
    setRequests(updatedRequests);
    
    // Store the rejected request for potential undo
    const rejectedRequest: ConsultRequest = { ...requestToReject };
    
    // Show feedback to the user with undo option
    toast.info('Request Rejected', {
      description: `Request from ${requestToReject.patientName} has been rejected.`,
      action: {
        label: 'Undo',
        onClick: () => {
          // Create a new array with the rejected request added back
          const restoredRequests = [...updatedRequests, rejectedRequest];
          setRequests(restoredRequests);
          
          toast.success('Request Restored', {
            description: `Request from ${rejectedRequest.patientName} has been restored.`
          });
        }
      }
    });
  };

  // Handle viewing a patient
  const handleViewPatient = (id: string) => {
    setSelected(id);
    setSearchParams({ patient: id });
  };

  // Rest of your component JSX...
  return (
    <div>
      {/* Your component JSX here */}
    </div>
  );
}
