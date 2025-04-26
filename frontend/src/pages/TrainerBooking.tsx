import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Calendar from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/Button';
import { Calendar as CalendarIcon, Clock, User, CheckCircle2, ChevronRight, Star, PlusCircle } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
// import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Label as UILabel } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';
import axios from 'axios';
import { Input } from '@/components/ui/Input';

interface TimeSlot {
  time: string;
  available: boolean;
}

interface Trainer {
  _id: string;
  id: number;
  name: string;
  specialization: string;
  rating: number;
}

const timeSlots: TimeSlot[] = [
  { time: '09:00 AM', available: true },
  { time: '10:00 AM', available: true },
  { time: '11:00 AM', available: true },
  { time: '12:00 PM', available: true },
  { time: '02:00 PM', available: true },
  { time: '03:00 PM', available: true },
  { time: '04:00 PM', available: true },
  { time: '05:00 PM', available: true },
];

function TrainerBooking() {
  const { user, isAuthenticated } = useAuth();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [selectedTrainer, setSelectedTrainer] = useState<number | null>(null);
  const [bookingStep, setBookingStep] = useState<'date' | 'time' | 'trainer' | 'confirm'>('date');
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [isCustomTime, setIsCustomTime] = useState(false);
  const [customHour, setCustomHour] = useState('');
  const [customMinute, setCustomMinute] = useState('');
  const [customPeriod, setCustomPeriod] = useState<'AM' | 'PM'>('AM');
  
  // API URLs
  const API_BASE_URL = `${import.meta.env.VITE_API_URL}/api/user`;
  
  useEffect(() => {
    getAllTrainers();
    
    if (!user) {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        console.log("Found user in localStorage");
      } else {
        console.log("No user found in localStorage");
      }
    }
  }, [user, isAuthenticated]);
  

  const getCurrentUser = () => {
    if (user) return user;
    
   
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        return JSON.parse(storedUser);
      } catch (e) {
        console.error("Failed to parse stored user:", e);
      }
    }
    return null;
  };
  

  const getUserId = (userObj: any) => {
    if (!userObj) return null;
    return userObj._id || userObj.id || null;
  };
  
  const handleDateSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate);
    setBookingStep('time');
  };

  const getAllTrainers = async () => {
    try {
      console.log(`Fetching trainers from: ${API_BASE_URL}/trainer/allTrainers`);
      const response = await axios.get(`${API_BASE_URL}/trainer/allTrainers`, {
        withCredentials: true
      });
      
      console.log("API response:", response.data);
      
      if (response.data && response.data.trainers) {
        console.log("Trainers data:", response.data.trainers);
        setTrainers(response.data.trainers);
      } else {
        console.error('Unexpected response format:', response.data);
        toast.error('Failed to load trainers: Unexpected response format');
      }
    } catch (error: any) {
      console.error("Error getting trainers:", error);
      console.error("Response details:", error.response?.status, error.response?.data);
      toast.error(`Error loading trainers: ${error.response?.data?.message || error.message}`);
    }
  };

  // New function to handle custom time changes
  const handleCustomTimeChange = () => {
    // Validate hour and minute
    const hour = parseInt(customHour);
    const minute = parseInt(customMinute);
    
    if (isNaN(hour) || hour < 1 || hour > 12) {
      toast.error('Please enter a valid hour (1-12)');
      return;
    }
    
    if (isNaN(minute) || minute < 0 || minute > 59) {
      toast.error('Please enter a valid minute (0-59)');
      return;
    }
    
    // Format the time string (e.g., "09:30 AM")
    const formattedHour = hour.toString().padStart(2, '0');
    const formattedMinute = minute.toString().padStart(2, '0');
    const timeString = `${formattedHour}:${formattedMinute} ${customPeriod}`;
    
    setSelectedTime(timeString);
    setBookingStep('trainer');
  };

  const handleTimeSelect = (time: string) => {
    if (time === 'custom') {
      setIsCustomTime(true);
      return;
    }
    
    setSelectedTime(time);
    setBookingStep('trainer');
  };

  const handleTrainerSelect = (trainerId: number) => {
    setSelectedTrainer(trainerId);
    setBookingStep('confirm');
  };

  // Generate a meeting link using frontend-only approach
  const generateMeetingLink = async () => {
    const currentUser = getCurrentUser();
    const userId = getUserId(currentUser);
    
    if (!currentUser || !userId) {
      toast.error('You must be logged in to book a session');
      console.error("Auth error - current user:", currentUser);
      return null;
    }
    
    try {
      // Create a unique room ID for the meeting
      const roomID = `meeting_${userId}_${Math.floor(Math.random() * 1000000)}`;
      
      // Create a direct meeting link using the room ID
      const frontendURL = window.location.origin;
      const meetingLink = `${frontendURL}/meeting/join/${roomID}`;
      
      console.log("Generated meeting link:", meetingLink);
      
      return {
        meetingLink,
        roomId: roomID
      };
    } catch (error) {
      console.error("Error generating meeting link:", error);
      setBookingError('Failed to generate meeting link. Please try again.');
      
      return null;
    }
  };

  const handleConfirmBooking = async () => {
    // Reset any previous errors
    setBookingError(null);
    
    const currentUser = getCurrentUser();
    const userId = getUserId(currentUser);
    
    console.log("Current user on confirm booking:", currentUser);
    
    if (!currentUser || !userId) {
      setBookingError('You must be logged in to book a session');
      return;
    }
    
    if (!selectedTrainerInfo || !selectedTrainerInfo._id) {
      setBookingError('Please select a trainer first');
      return;
    }
    
    if (!date || !selectedTime) {
      setBookingError('Please select a date and time');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Generate meeting link
      const meetingData = await generateMeetingLink();
      
      if (!meetingData || !meetingData.meetingLink) {
        throw new Error('Failed to generate meeting link');
      }
      
      // Combine date and time to create a proper scheduledTime
      let scheduledDateTime = null;
      if (date) {
        // Parse the time string - works for both predefined and custom time formats
        // Format is: "09:30 AM" or "02:15 PM"
        const timeMatch = selectedTime.match(/(\d+):(\d+)\s+(AM|PM)/i);
        if (!timeMatch) {
          throw new Error('Invalid time format: ' + selectedTime);
        }
        
        const [_, hours, minutes, period] = timeMatch;
        
        scheduledDateTime = new Date(date);
        let hour = parseInt(hours);
        
        // Convert to 24-hour format
        if (period.toUpperCase() === 'PM' && hour < 12) hour += 12;
        if (period.toUpperCase() === 'AM' && hour === 12) hour = 0;
        
        scheduledDateTime.setHours(hour, parseInt(minutes), 0);
        
        // Add extra logging for debugging
        console.log("Parsed time:", {
          originalTime: selectedTime,
          hours: hours,
          minutes: minutes,
          period: period,
          hour24: hour,
          finalDateTime: scheduledDateTime
        });
      }
      
      if (!scheduledDateTime) {
        throw new Error('Failed to parse date/time');
      }
      
      // Send booking data to the server
      const response = await axios.post(`${API_BASE_URL}/trainer/bookTrainer`, {
        trainerId: selectedTrainerInfo._id,
        userId: userId,
        meetingLink: meetingData.meetingLink,
        scheduledTime: scheduledDateTime.toISOString(),
        roomId: meetingData.roomId
      }, {
        withCredentials: true
      });

      if (response.data && response.data.TrainingSession) {
        // Handle successful booking
        toast.success('Training session booked successfully!');
        console.log('Session booked:', response.data.TrainingSession);
        
        // Reset form
        setDate(undefined);
        setSelectedTime('');
        setSelectedTrainer(null);
        setBookingStep('date');
        setIsCustomTime(false);
        setCustomHour('');
        setCustomMinute('');
        setCustomPeriod('AM');
      } else {
        throw new Error('Booking response is incomplete');
      }
    } catch (error: any) {
      console.error('Error creating booking:', error);
      
      // Extract error message
      const errorMessage = error.response?.data?.message || 'Failed to create booking. Please try again.';
      setBookingError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedTrainerInfo = trainers.find(trainer => trainer.id === selectedTrainer);

  const handleBack = () => {
    if (bookingStep === 'date') return;
    
    if (bookingStep === 'time') {
      setBookingStep('date');
    } else if (bookingStep === 'trainer') {
      setBookingStep('time');
      // Clear custom time state if going back from trainer selection
      setIsCustomTime(false);
    } else if (bookingStep === 'confirm') {
      setBookingStep('trainer');
    }
    
    // Clear any error when going back
    setBookingError(null);
  };

  const handleNext = () => {
    if (bookingStep === 'date' && date) setBookingStep('time');
    else if (bookingStep === 'time' && selectedTime) setBookingStep('trainer');
    else if (bookingStep === 'trainer' && selectedTrainer) setBookingStep('confirm');
    else if (bookingStep === 'confirm') handleConfirmBooking();
  };

  return (
    <div className="container w-full min-h-screen overflow-hidden py-12 mx-auto px-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center mb-12"
      >
        <div className="relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-primary to-primary/50 rounded-lg blur opacity-25"></div>
          <h1 className="relative text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/50 mb-3">
            Book a Training Session
          </h1>
        </div>
        <p className="text-muted-foreground text-center max-w-2xl">
          Schedule your personalized training session with our expert trainers
        </p>
      </motion.div>

      <div className="space-y-8">
        {/* Progress Steps */}
        <div className="flex justify-center items-center space-x-4 mb-8">
          {['date', 'time', 'trainer', 'confirm'].map((step, index) => (
            <div key={step} className="flex items-center">
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center",
                bookingStep === step ? "bg-primary text-white" : "bg-muted text-muted-foreground"
              )}>
                {index + 1}
              </div>
              {index < 3 && (
                <div className={cn(
                  "w-16 h-1 mx-2",
                  bookingStep === step ? "bg-primary" : "bg-muted"
                )} />
              )}
            </div>
          ))}
        </div>

        {/* Booking Steps */}
        <Card className="border-2 hover:border-primary/50 transition-colors duration-300">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-xl">
              {bookingStep === 'date' && <CalendarIcon className="w-6 h-6 text-primary" />}
              {bookingStep === 'time' && <Clock className="w-6 h-6 text-primary" />}
              {bookingStep === 'trainer' && <User className="w-6 h-6 text-primary" />}
              {bookingStep === 'confirm' && <CheckCircle2 className="w-6 h-6 text-primary" />}
              {bookingStep === 'date' && 'Select Date'}
              {bookingStep === 'time' && 'Select Time'}
              {bookingStep === 'trainer' && 'Choose Trainer'}
              {bookingStep === 'confirm' && 'Confirm Booking'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {bookingStep === 'date' && (
              <div className="flex justify-center">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={handleDateSelect}
                  className="rounded-md border"
                />
              </div>
            )}

            {bookingStep === 'time' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <UILabel>Select Time Slot</UILabel>
                  <span className="text-xs text-muted-foreground">Need a different time? Try the Custom Time option</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                  {timeSlots.map((slot) => (
                    <Button
                      key={slot.time}
                      variant={selectedTime === slot.time ? "default" : "outline"}
                      className="w-full"
                      disabled={!slot.available}
                      onClick={() => handleTimeSelect(slot.time)}
                    >
                      <Clock className="w-4 h-4 mr-2" />
                      {slot.time}
                    </Button>
                  ))}
                  
                  {/* Custom time button */}
                  <Button
                    variant={isCustomTime ? "default" : "outline"}
                    className="w-full"
                    onClick={() => handleTimeSelect('custom')}
                  >
                    <PlusCircle className="w-4 h-4 mr-2" />
                    Custom Time
                  </Button>
                </div>
                
                {/* Custom time input fields */}
                {isCustomTime && (
                  <div className="mt-6 p-4 border rounded-md bg-muted/20">
                    <h3 className="text-sm font-medium mb-3">Enter Custom Time</h3>
                    <div className="grid grid-cols-6 gap-2 items-center">
                      <div className="col-span-2">
                        <UILabel htmlFor="customHour" className="text-xs mb-1 block">Hour (1-12)</UILabel>
                        <Input 
                          id="customHour"
                          type="number" 
                          min="1" 
                          max="12" 
                          value={customHour}
                          onChange={(e) => setCustomHour(e.target.value)}
                          placeholder="Hour"
                          className="h-9"
                        />
                      </div>
                      <div className="col-span-2">
                        <UILabel htmlFor="customMinute" className="text-xs mb-1 block">Minute (0-59)</UILabel>
                        <Input 
                          id="customMinute"
                          type="number" 
                          min="0" 
                          max="59" 
                          value={customMinute}
                          onChange={(e) => setCustomMinute(e.target.value)}
                          placeholder="Minute"
                          className="h-9"
                        />
                      </div>
                      <div className="col-span-2">
                        <UILabel className="text-xs mb-1 block">AM/PM</UILabel>
                        <div className="flex gap-2">
                          <Button 
                            type="button" 
                            variant={customPeriod === 'AM' ? 'default' : 'outline'}
                            className="flex-1 h-9"
                            onClick={() => setCustomPeriod('AM')}
                          >
                            AM
                          </Button>
                          <Button 
                            type="button" 
                            variant={customPeriod === 'PM' ? 'default' : 'outline'}
                            className="flex-1 h-9"
                            onClick={() => setCustomPeriod('PM')}
                          >
                            PM
                          </Button>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 flex justify-end">
                      <Button 
                        onClick={handleCustomTimeChange}
                        size="sm"
                      >
                        Confirm Time
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {bookingStep === 'trainer' && (
              <div className="space-y-4">
                <UILabel>Select Your Trainer</UILabel>
                {trainers.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {trainers.map((trainer) => (
                      <Card
                        key={trainer._id}
                        className={`cursor-pointer transition-all ${
                          selectedTrainer === trainer.id
                            ? "border-primary shadow-lg scale-105"
                            : "hover:border-primary/50"
                        }`}
                        onClick={() => handleTrainerSelect(trainer.id)}
                      >
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <User className="w-5 h-5" />
                            {trainer.name}
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            <p className="text-sm text-muted-foreground">{trainer.specialization}</p>
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                              <span className="text-sm">{trainer.rating}</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No trainers available at the moment. Please try again later.</p>
                  </div>
                )}
              </div>
            )}

            {bookingStep === 'confirm' && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <h3 className="font-semibold">Booking Summary</h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <CalendarIcon className="w-5 h-5 text-primary" />
                      <div>
                        <p className="text-sm text-muted-foreground">Date</p>
                        <p className="font-medium">{date && format(date, 'PPP')}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-5 h-5 text-primary" />
                      <div>
                        <p className="text-sm text-muted-foreground">Time</p>
                        <p className="font-medium">{selectedTime}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <User className="w-5 h-5 text-primary" />
                      <div>
                        <p className="text-sm text-muted-foreground">Trainer</p>
                        <p className="font-medium">
                          {selectedTrainerInfo?.name}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {bookingError && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-600 text-sm">
                    {bookingError}
                  </div>
                )}
                
                <Button 
                  onClick={handleConfirmBooking}
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Creating Booking...' : 'Confirm Booking'}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Navigation buttons */}
        <div className="flex justify-between mt-8">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={bookingStep === 'date'}
          >
            Back
          </Button>
          <Button
            onClick={handleNext}
            disabled={
              (bookingStep === 'date' && !date) ||
              (bookingStep === 'time' && !selectedTime && !isCustomTime) ||
              (bookingStep === 'trainer' && !selectedTrainer) ||
              isSubmitting
            }
          >
            {bookingStep === 'confirm' ? 'Confirm Booking' : 'Next'}
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}

export default TrainerBooking; 