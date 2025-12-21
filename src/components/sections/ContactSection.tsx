import { motion, useInView } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { Mail, Phone, MapPin, Send, Calendar, Clock, CheckCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { fetchSlots, createBooking } from '@/services/api';

interface TimeSlot {
  id: string;
  slot_date: string;
  start_time: string;
  end_time: string;
  is_available: boolean;
}

const contactInfo = [
  {
    icon: Phone,
    label: 'Phone',
    value: '+91 98765 43210',
    href: 'tel:+919876543210',
  },
  {
    icon: Mail,
    label: 'Email',
    value: 'hello@speakenglish.academy',
    href: 'mailto:hello@speakenglish.academy',
  },
  {
    icon: MapPin,
    label: 'Location',
    value: 'Mumbai, Maharashtra',
    href: '#',
  },
];

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
};

const formatTime = (timeStr: string) => {
  const [hours] = timeStr.split(':');
  const hour = parseInt(hours);
  return hour >= 12 ? `${hour === 12 ? 12 : hour - 12}:00 PM` : `${hour}:00 AM`;
};

export default function ContactSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasBooked, setHasBooked] = useState(false);
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<string>('');
  const [loadingSlots, setLoadingSlots] = useState(true);
  const [bookingDetails, setBookingDetails] = useState<{
    slot: { slot_date: string; start_time: string; end_time: string } | null;
  } | null>(null);

  // Check if user has already booked (using localStorage for session tracking)
  useEffect(() => {
    const bookedStatus = localStorage.getItem('hasBookedTrial');
    if (bookedStatus) {
      setHasBooked(true);
    }
  }, []);

  // Fetch available slots
  useEffect(() => {
    loadSlots();
  }, []);

  const loadSlots = async () => {
  setLoadingSlots(true);
  try {
    const slotsData = await fetchSlots();
    setSlots(slotsData || []);
  } catch (error) {
    console.error('Error fetching slots:', error);
    toast({
      title: 'Error',
      description: 'Failed to load available time slots. Please try again.',
      variant: 'destructive',
    });
  } finally {
    setLoadingSlots(false);
  }
};

const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  setIsSubmitting(true);

  const formData = new FormData(e.currentTarget);
  const bookingData = {
    name: formData.get('name') as string,
    email: formData.get('email') as string,
    phone: formData.get('phone') as string,
    course: formData.get('course') as string,
    message: formData.get('message') as string,
    slotId: selectedSlot,
  };

  try {
    const data = await createBooking(bookingData);

    setHasBooked(true);
    setBookingDetails({ slot: data.booking });
    localStorage.setItem('hasBookedTrial', 'true');

    toast({
      title: 'Booking Confirmed!',
      description: 'Your free trial class has been booked. We look forward to meeting you!',
    });

    (e.target as HTMLFormElement).reset();
    setSelectedSlot('');
    loadSlots();
  } catch (error: any) {
    console.error('Booking error:', error);
    toast({
      title: 'Booking Failed',
      description: error.message || 'An unexpected error occurred. Please try again.',
      variant: 'destructive',
    });
  } finally {
    setIsSubmitting(false);
  }
};


  const handleBookAgain = () => {
    setHasBooked(false);
    setBookingDetails(null);
    localStorage.removeItem('hasBookedTrial');
  };

  // Group slots by date
  const slotsByDate = slots.reduce((acc, slot) => {
    if (!acc[slot.slot_date]) {
      acc[slot.slot_date] = [];
    }
    acc[slot.slot_date].push(slot);
    return acc;
  }, {} as Record<string, TimeSlot[]>);

  return (
    <section id="contact" className="py-24 md:py-32 bg-secondary/30 relative">
      <div className="container mx-auto px-6" ref={ref}>
        <div className="grid lg:grid-cols-2 gap-16">
          {/* Left - Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <span className="text-primary font-semibold tracking-wider uppercase text-sm">Get in Touch</span>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mt-4 mb-6">
              Start Your
              <span className="text-primary"> Free Trial</span>
              <span className="block">Today</span>
            </h2>
            
            <p className="text-lg text-muted-foreground mb-10 leading-relaxed">
              Ready to transform your English speaking skills? Book a free trial class and experience 
              our teaching methodology firsthand. No commitment required!
            </p>

            {/* Contact Cards */}
            <div className="space-y-4 mb-10">
              {contactInfo.map((item, index) => (
                <motion.a
                  key={item.label}
                  href={item.href}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                  className="flex items-center gap-4 p-4 bg-card rounded-xl shadow-vintage hover:shadow-card transition-all group"
                >
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary transition-colors">
                    <item.icon className="w-6 h-6 text-primary group-hover:text-primary-foreground transition-colors" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{item.label}</p>
                    <p className="font-semibold text-foreground">{item.value}</p>
                  </div>
                </motion.a>
              ))}
            </div>

            {/* Schedule Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="p-6 bg-primary/5 rounded-xl border border-primary/10"
            >
              <h4 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" />
                Class Schedule
              </h4>
              <div className="space-y-2 text-muted-foreground">
                <p className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Monday - Saturday: 9:00 AM - 8:00 PM
                </p>
                <p className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Sunday: By Appointment Only
                </p>
              </div>
            </motion.div>
          </motion.div>

          {/* Right - Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="bg-card rounded-2xl p-8 md:p-10 shadow-card">
              {hasBooked && bookingDetails ? (
                // Success state with booking details
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-10 h-10 text-green-600" />
                  </div>
                  <h3 className="font-display text-2xl font-bold text-foreground mb-4">
                    Booking Confirmed!
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    Your free trial class has been scheduled for:
                  </p>
                  {bookingDetails.slot && (
                    <div className="bg-primary/10 rounded-lg p-4 mb-6">
                      <p className="font-semibold text-primary text-lg">
                        {formatDate(bookingDetails.slot.slot_date)}
                      </p>
                      <p className="text-foreground">
                        {formatTime(bookingDetails.slot.start_time)} - {formatTime(bookingDetails.slot.end_time)}
                      </p>
                    </div>
                  )}
                  <p className="text-sm text-muted-foreground mb-6">
                    We'll send you a confirmation email with all the details. See you soon!
                  </p>
                  <Button onClick={handleBookAgain} variant="outline" className="gap-2">
                    <RefreshCw className="w-4 h-4" />
                    Book Again
                  </Button>
                </div>
              ) : (
                // Booking form
                <>
                  <h3 className="font-display text-2xl font-bold text-foreground mb-6">
                    Book Your Free Trial Class
                  </h3>
                  
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                          Full Name
                        </label>
                        <Input
                          id="name"
                          name="name"
                          placeholder="Your name"
                          required
                          minLength={2}
                          maxLength={100}
                        />
                      </div>
                      <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-foreground mb-2">
                          Phone Number
                        </label>
                        <Input
                          id="phone"
                          name="phone"
                          type="tel"
                          placeholder="+91 98765 43210"
                          required
                          pattern="[\d\s+\-()]{10,}"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                        Email Address
                      </label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="you@example.com"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="course" className="block text-sm font-medium text-foreground mb-2">
                        Interested Course
                      </label>
                      <select
                        id="course"
                        name="course"
                        className="w-full h-10 px-3 rounded-md border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                        required
                      >
                        <option value="">Select a course</option>
                        <option value="student">Student Foundation</option>
                        <option value="professional">Professional Excellence</option>
                        <option value="competitive">Competitive Edge</option>
                        <option value="teacher">Teacher Training</option>
                      </select>
                    </div>

                    {/* Time Slot Selection */}
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Select Time Slot
                      </label>
                      {loadingSlots ? (
                        <div className="text-center py-4 text-muted-foreground">
                          Loading available slots...
                        </div>
                      ) : Object.keys(slotsByDate).length === 0 ? (
                        <div className="text-center py-4 text-muted-foreground">
                          No slots available at the moment. Please check back later.
                        </div>
                      ) : (
                        <div className="space-y-4 max-h-48 overflow-y-auto border border-input rounded-lg p-3">
                          {Object.entries(slotsByDate).slice(0, 7).map(([date, dateSlots]) => (
                            <div key={date}>
                              <p className="text-sm font-medium text-foreground mb-2">
                                {formatDate(date)}
                              </p>
                              <div className="flex flex-wrap gap-2">
                                {dateSlots.map((slot) => (
                                  <button
                                    key={slot.id}
                                    type="button"
                                    onClick={() => setSelectedSlot(slot.id)}
                                    className={`px-3 py-1.5 text-sm rounded-md border transition-colors ${
                                      selectedSlot === slot.id
                                        ? 'bg-primary text-primary-foreground border-primary'
                                        : 'bg-background border-input hover:border-primary hover:bg-primary/5'
                                    }`}
                                  >
                                    {formatTime(slot.start_time)}
                                  </button>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                      {!selectedSlot && slots.length > 0 && (
                        <p className="text-xs text-destructive mt-1">Please select a time slot</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-foreground mb-2">
                        Your Message (Optional)
                      </label>
                      <Textarea
                        id="message"
                        name="message"
                        placeholder="Tell us about your goals and current English level..."
                        rows={3}
                        maxLength={500}
                      />
                    </div>

                    <Button 
                      type="submit" 
                      size="lg" 
                      className="w-full" 
                      disabled={isSubmitting || !selectedSlot || loadingSlots}
                    >
                      {isSubmitting ? (
                        'Booking...'
                      ) : (
                        <>
                          Book Free Trial
                          <Send className="w-4 h-4 ml-2" />
                        </>
                      )}
                    </Button>

                    <p className="text-xs text-muted-foreground text-center">
                      By submitting this form, you agree to our terms and conditions.
                    </p>
                  </form>
                </>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}