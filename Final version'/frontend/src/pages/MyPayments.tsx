import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { ArrowLeft, CreditCard, Search, Download, Calendar, AlertCircle } from 'lucide-react';
import { usePayments } from '@/hooks/usePayments';
import { useAuth } from '@/context/AuthContext';

const MyPayments = () => {
  const navigate = useNavigate();
  const { userEmail } = useAuth();
  const { getPaymentsByUserId } = usePayments();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'completed' | 'failed'>('all');

  // Get user's payments
  const userPayments = userEmail ? getPaymentsByUserId(userEmail) : [];

  // Filter payments
  const filteredPayments = userPayments.filter(payment => {
    const matchesSearch = 
      payment.eventTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.transactionId?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' ? true : payment.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  // Calculate stats
  const completedPayments = userPayments.filter(p => p.status === 'completed');
  const totalSpent = completedPayments.reduce((sum, p) => sum + p.amount, 0);
  const pendingPayments = userPayments.filter(p => p.status === 'pending');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500/20 text-green-600 dark:text-green-400';
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-600 dark:text-yellow-400';
      case 'failed':
        return 'bg-red-500/20 text-red-600 dark:text-red-400';
      default:
        return 'bg-gray-500/20 text-gray-600 dark:text-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return '✓';
      case 'pending':
        return '⏳';
      case 'failed':
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
                My Payments
              </h1>
              <p className="text-white/80 text-lg">Manage and track your event registrations</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="container mx-auto py-12 px-4">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Card className="bg-white dark:bg-slate-900 border-border">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Paid</p>
                    <p className="text-3xl font-bold text-foreground">₹{totalSpent.toLocaleString('en-IN')}</p>
                  </div>
                  <CreditCard className="w-8 h-8 text-primary opacity-20" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-slate-900 border-border">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Completed</p>
                    <p className="text-3xl font-bold text-green-600 dark:text-green-400">{completedPayments.length}</p>
                  </div>
                  <div className="text-2xl">✓</div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-slate-900 border-border">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Pending</p>
                    <p className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">{pendingPayments.length}</p>
                  </div>
                  <div className="text-2xl">⏳</div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Payments Table */}
          <Card className="bg-white dark:bg-slate-900 border-border">
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <CardTitle className="text-foreground">Payment History</CardTitle>
                  <CardDescription>View and manage all your event payments</CardDescription>
                </div>
              </div>

              {/* Filters */}
              <div className="flex flex-col md:flex-row gap-4 mt-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by event name or transaction ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-background border-border"
                  />
                </div>

                <Tabs 
                  value={filterStatus} 
                  onValueChange={(value) => setFilterStatus(value as 'all' | 'pending' | 'completed' | 'failed')}
                  className="w-full md:w-auto"
                >
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="all">All</TabsTrigger>
                    <TabsTrigger value="completed">Completed</TabsTrigger>
                    <TabsTrigger value="pending">Pending</TabsTrigger>
                    <TabsTrigger value="failed">Failed</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </CardHeader>

            <CardContent>
              {filteredPayments.length > 0 ? (
                <div className="space-y-4">
                  {filteredPayments.map((payment) => (
                    <div 
                      key={payment.id}
                      className="flex flex-col md:flex-row md:items-center justify-between p-4 border border-border rounded-lg hover:bg-secondary/50 transition-colors"
                    >
                      <div className="flex-1 mb-4 md:mb-0">
                        <div className="flex items-start gap-4">
                          <div className="p-2 bg-primary/10 rounded-lg">
                            <CreditCard className="w-5 h-5 text-primary" />
                          </div>
                          <div className="flex-1">
                            <p className="font-semibold text-foreground">{payment.eventTitle}</p>
                            <div className="flex flex-wrap gap-3 mt-2 text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                {new Date(payment.paymentDate).toLocaleDateString('en-IN')}
                              </div>
                              <span>•</span>
                              <span>TXN: {payment.transactionId}</span>
                              <span>•</span>
                              <span>{payment.paymentMethod}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6">
                        <div className="text-right">
                          <p className="text-2xl font-bold text-foreground">₹{payment.amount.toLocaleString('en-IN')}</p>
                          <Badge className={getStatusColor(payment.status)}>
                            <span className="mr-1">{getStatusIcon(payment.status)}</span>
                            {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                          </Badge>
                        </div>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.print()}
                          className="flex items-center gap-2"
                        >
                          <Download className="w-4 h-4" />
                          Receipt
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  {userPayments.length === 0 ? (
                    <>
                      <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                      <p className="text-muted-foreground text-lg mb-4">No payments yet</p>
                      <p className="text-muted-foreground text-sm mb-6">
                        Register for paid events to see your payment history here
                      </p>
                      <Button 
                        onClick={() => navigate('/events')}
                        className="bg-gradient-accent hover:opacity-90 text-white"
                      >
                        Browse Events
                      </Button>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                      <p className="text-muted-foreground text-lg">No payments match your search</p>
                    </>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Support Section */}
          {userPayments.length > 0 && (
            <Card className="bg-blue-500/10 border-blue-500/20 mt-8">
              <CardHeader>
                <CardTitle className="text-foreground">Need Help?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-foreground/80 mb-4">
                  If you have questions about your payments or need to make changes, our support team is here to help.
                </p>
                <Button variant="outline" className="text-blue-600 dark:text-blue-400 border-blue-500/30">
                  Contact Support
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default MyPayments;
