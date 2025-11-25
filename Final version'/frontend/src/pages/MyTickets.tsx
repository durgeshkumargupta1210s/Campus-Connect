import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Ticket, Calendar, MapPin, Copy, Download, AlertCircle } from 'lucide-react';
import { useTickets } from '@/hooks/useTickets';
import { useAuth } from '@/context/AuthContext';

const MyTickets = () => {
  const navigate = useNavigate();
  const { userEmail } = useAuth();
  const { getMyTickets, updateTicketStatus } = useTickets();

  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'used' | 'cancelled'>('all');
  const [copiedTicketId, setCopiedTicketId] = useState<string>('');

  const userTickets = userEmail ? getMyTickets(userEmail) : [];

  const filteredTickets = userTickets.filter(ticket => {
    if (filterStatus === 'all') return true;
    return ticket.status === filterStatus;
  });

  const handleCopyCode = (code: string, ticketId: string) => {
    navigator.clipboard.writeText(code);
    setCopiedTicketId(ticketId);
    setTimeout(() => setCopiedTicketId(''), 2000);
  };

  const downloadTicketPDF = async (ticketId: string) => {
    try {
      // Dynamically import CommonJS modules to avoid ESM issues
      const html2canvas = (await import('html2canvas')).default;
      const jsPDF = (await import('jspdf')).jsPDF;

      const ticketElement = document.getElementById(`ticket-${ticketId}`);
      if (!ticketElement) return;

      const canvas = await html2canvas(ticketElement, {
        backgroundColor: '#ffffff',
        scale: 2,
      });

      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const imgData = canvas.toDataURL('image/png');
      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save(`ticket-${ticketId}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500/20 text-green-600 dark:text-green-400';
      case 'used':
        return 'bg-blue-500/20 text-blue-600 dark:text-blue-400';
      case 'cancelled':
        return 'bg-red-500/20 text-red-600 dark:text-red-400';
      default:
        return 'bg-gray-500/20 text-gray-600 dark:text-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return '✓';
      case 'used':
        return '✓';
      case 'cancelled':
        return '✕';
      default:
        return '•';
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 bg-background">
        {/* Header */}
        <div className="bg-gradient-hero py-8 px-4 border-b border-white/10">
          <div className="container mx-auto">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-white hover:text-white/80 transition-colors mb-6"
            >
              <ArrowLeft className="w-5 h-5" />
              Back
            </button>

            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
                My Event Tickets
              </h1>
              <p className="text-white/80 text-lg">View and manage your event tickets</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="container mx-auto py-12 px-4">
          {userTickets.length > 0 ? (
            <>
              {/* Filter Tabs */}
              <div className="mb-8">
                <Tabs 
                  value={filterStatus} 
                  onValueChange={(value) => setFilterStatus(value as 'all' | 'active' | 'used' | 'cancelled')}
                  className="w-full"
                >
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="all">
                      All ({userTickets.length})
                    </TabsTrigger>
                    <TabsTrigger value="active">
                      Active ({userTickets.filter(t => t.status === 'active').length})
                    </TabsTrigger>
                    <TabsTrigger value="used">
                      Used ({userTickets.filter(t => t.status === 'used').length})
                    </TabsTrigger>
                    <TabsTrigger value="cancelled">
                      Cancelled ({userTickets.filter(t => t.status === 'cancelled').length})
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>

              {/* Tickets Grid */}
              <div className="space-y-6">
                {filteredTickets.map((ticket) => (
                  <Card key={ticket.id} className="bg-white dark:bg-slate-900 border-border overflow-hidden" id={`ticket-${ticket.id}`}>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
                      {/* Ticket Info */}
                      <div className="md:col-span-2 space-y-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="text-2xl font-bold text-foreground">{ticket.eventTitle}</h3>
                            <p className="text-sm text-muted-foreground mt-1">
                              Ticket: <span className="font-mono font-semibold text-foreground">{ticket.ticketNumber}</span>
                            </p>
                          </div>
                          <Badge className={getStatusColor(ticket.status)}>
                            <span className="mr-1">{getStatusIcon(ticket.status)}</span>
                            {ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}
                          </Badge>
                        </div>

                        {/* Event Details */}
                        <div className="space-y-3 pt-4 border-t border-border">
                          <div className="flex items-center gap-3">
                            <Calendar className="w-4 h-4 text-primary" />
                            <div>
                              <p className="text-xs text-muted-foreground">Date & Time</p>
                              <p className="font-semibold text-foreground">
                                {ticket.eventDate}
                                {ticket.eventStartTime && ` at ${ticket.eventStartTime}`}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <MapPin className="w-4 h-4 text-accent" />
                            <div>
                              <p className="text-xs text-muted-foreground">Location</p>
                              <p className="font-semibold text-foreground">{ticket.eventLocation}</p>
                            </div>
                          </div>

                          {ticket.seat && (
                            <div className="flex items-center gap-3">
                              <Ticket className="w-4 h-4 text-primary" />
                              <div>
                                <p className="text-xs text-muted-foreground">Seat</p>
                                <p className="font-semibold text-foreground">{ticket.seat}</p>
                              </div>
                            </div>
                          )}

                          {ticket.tier && (
                            <div>
                              <p className="text-xs text-muted-foreground">Ticket Tier</p>
                              <Badge variant="outline">{ticket.tier}</Badge>
                            </div>
                          )}

                          {/* Verification Code */}
                          <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                            <p className="text-xs text-muted-foreground mb-2">Verification Code</p>
                            <div className="flex items-center justify-between">
                              <p className="font-mono text-lg font-bold text-foreground">{ticket.verificationCode}</p>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleCopyCode(ticket.verificationCode, ticket.id)}
                                className="gap-1"
                              >
                                <Copy className="w-3 h-3" />
                                {copiedTicketId === ticket.id ? 'Copied!' : 'Copy'}
                              </Button>
                            </div>
                            <p className="text-xs text-muted-foreground mt-2">Show this code at entry for quick verification</p>
                          </div>
                        </div>
                      </div>

                      {/* QR Code Section */}
                      <div className="flex flex-col items-center justify-center p-4 bg-secondary/50 rounded-lg">
                        <p className="text-xs text-muted-foreground mb-3 text-center">Scan for Entry</p>
                        <QRCodeDisplay 
                          value={`${ticket.id}|${ticket.verificationCode}`}
                          size={180}
                        />
                        <p className="text-xs text-muted-foreground text-center mt-4">
                          Scan this QR code at the venue entrance for quick entry
                        </p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="border-t border-border bg-secondary/30 px-6 py-4 flex gap-3 flex-wrap">
                      <Button
                        onClick={() => downloadTicketPDF(ticket.id)}
                        variant="outline"
                        className="gap-2"
                      >
                        <Download className="w-4 h-4" />
                        Download PDF
                      </Button>

                      {ticket.status === 'active' && (
                        <>
                          <Button
                            onClick={() => {
                              if (confirm('Mark this ticket as used?')) {
                                updateTicketStatus(ticket.id, 'used');
                              }
                            }}
                            variant="outline"
                            className="gap-2"
                          >
                            ✓ Mark as Used
                          </Button>

                          <Button
                            onClick={() => {
                              if (confirm('Cancel this ticket?')) {
                                updateTicketStatus(ticket.id, 'cancelled');
                              }
                            }}
                            variant="outline"
                            className="gap-2 text-red-600 dark:text-red-400"
                          >
                            ✕ Cancel Ticket
                          </Button>
                        </>
                      )}

                      <Button
                        onClick={() => navigate(`/events/${ticket.eventId}`)}
                        variant="outline"
                        className="gap-2 ml-auto"
                      >
                        View Event
                      </Button>
                    </div>

                    {ticket.status === 'used' && (
                      <div className="bg-blue-500/10 border-t border-blue-500/20 px-6 py-3">
                        <p className="text-xs text-blue-600 dark:text-blue-400">
                          ✓ This ticket was used on {new Date(ticket.issuedDate).toLocaleDateString('en-IN')}
                        </p>
                      </div>
                    )}

                    {ticket.status === 'cancelled' && (
                      <div className="bg-red-500/10 border-t border-red-500/20 px-6 py-3">
                        <p className="text-xs text-red-600 dark:text-red-400">
                          ✕ This ticket has been cancelled
                        </p>
                      </div>
                    )}
                  </Card>
                ))}
              </div>

              {filteredTickets.length === 0 && (
                <Card className="bg-white dark:bg-slate-900 border-border">
                  <CardContent className="py-12 text-center">
                    <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                    <p className="text-muted-foreground text-lg">No {filterStatus !== 'all' ? filterStatus : ''} tickets found</p>
                  </CardContent>
                </Card>
              )}
            </>
          ) : (
            <Card className="bg-white dark:bg-slate-900 border-border">
              <CardContent className="py-12">
                <div className="text-center">
                  <Ticket className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                  <h2 className="text-2xl font-bold text-foreground mb-2">No Tickets Yet</h2>
                  <p className="text-muted-foreground mb-6">
                    You haven't purchased any event tickets yet.
                  </p>
                  <Button
                    onClick={() => navigate('/events')}
                    className="bg-gradient-accent hover:opacity-90 text-white"
                  >
                    Browse Events
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Help Section */}
          {userTickets.length > 0 && (
            <Card className="bg-blue-500/10 border-blue-500/20 mt-8">
              <CardHeader>
                <CardTitle className="text-foreground">🎫 How to Use Your Ticket</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-foreground/80">
                <div className="flex gap-3">
                  <span className="font-bold text-primary">1</span>
                  <span>Save or print this page or download the PDF</span>
                </div>
                <div className="flex gap-3">
                  <span className="font-bold text-primary">2</span>
                  <span>Arrive at the venue 15 minutes before the event start time</span>
                </div>
                <div className="flex gap-3">
                  <span className="font-bold text-primary">3</span>
                  <span>Show the QR code or verification code to entry staff</span>
                </div>
                <div className="flex gap-3">
                  <span className="font-bold text-primary">4</span>
                  <span>They will scan your code and mark your entry</span>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

// Simple QR Code Display Component using Canvas
interface QRCodeDisplayProps {
  value: string;
  size: number;
}

const QRCodeDisplay: React.FC<QRCodeDisplayProps> = ({ value, size }) => {
  const [dataUrl, setDataUrl] = useState<string>('');

  React.useEffect(() => {
    // Create a simple encoded QR placeholder with data
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    
    if (ctx) {
      // Fill white background
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, size, size);
      
      // Create a simple pattern representing the QR data
      const hash = value.split('').reduce((acc, char) => ((acc << 5) - acc) + char.charCodeAt(0), 0);
      ctx.fillStyle = 'black';
      
      const moduleSize = Math.ceil(size / 21);
      for (let i = 0; i < 21; i++) {
        for (let j = 0; j < 21; j++) {
          const bit = (hash >> (i + j)) & 1;
          if (bit || (i < 7 && j < 7) || (i < 7 && j >= 14) || (i >= 14 && j < 7)) {
            ctx.fillRect(j * moduleSize, i * moduleSize, moduleSize, moduleSize);
          }
        }
      }
      
      const dataUrlString = canvas.toDataURL('image/png');
      setDataUrl(dataUrlString);
    }
  }, [value, size]);

  return (
    <div className="bg-white p-3 rounded-lg">
      {dataUrl ? (
        <img 
          src={dataUrl} 
          alt="QR Code" 
          width={size} 
          height={size}
          className="pixelated"
        />
      ) : (
        <div 
          className="bg-gray-100 rounded animate-pulse"
          style={{ width: `${size}px`, height: `${size}px` }}
        />
      )}
    </div>
  );
};

export default MyTickets;

