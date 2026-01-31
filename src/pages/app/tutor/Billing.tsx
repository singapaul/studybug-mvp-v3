import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CreditCard, Check, Download, ExternalLink } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export default function Billing() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Billing</h1>
        <p className="text-muted-foreground">Manage your subscription and payment details</p>
      </div>

      {/* Current Subscription */}
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-lg font-semibold text-foreground">Tutor Monthly</h3>
                <Badge className="bg-amber-500">Trial</Badge>
              </div>
              <p className="text-muted-foreground mb-4">
                5 days remaining in your free trial
              </p>
              <div className="flex items-center gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Next billing date:</span>
                  <span className="ml-2 font-medium text-foreground">Feb 5, 2026</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Amount:</span>
                  <span className="ml-2 font-medium text-foreground">£12/month</span>
                </div>
              </div>
            </div>
            <Button variant="outline" disabled>
              <ExternalLink className="w-4 h-4 mr-2" />
              Manage Subscription
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-4">
            Stripe integration coming soon
          </p>
        </CardContent>
      </Card>

      {/* Plan Features */}
      <Card>
        <CardHeader>
          <CardTitle>Your Plan Includes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-2 gap-3">
            {[
              'Create unlimited games',
              'Create unlimited classes',
              'Invite unlimited students',
              'Track student progress',
              'Multiple Choice & Flashcards',
              'Priority support',
            ].map((feature) => (
              <div key={feature} className="flex items-center gap-2 text-sm">
                <Check className="w-4 h-4 text-primary" />
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Payment Method */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Method</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-8 bg-muted rounded flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-muted-foreground" />
              </div>
              <div>
                <p className="font-medium text-foreground">•••• •••• •••• 4242</p>
                <p className="text-sm text-muted-foreground">Expires 12/2028</p>
              </div>
            </div>
            <Button variant="outline" size="sm" disabled>
              Update
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-4">
            Payment method management coming soon
          </p>
        </CardContent>
      </Card>

      {/* Billing History */}
      <Card>
        <CardHeader>
          <CardTitle>Billing History</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Invoice</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>Jan 1, 2026</TableCell>
                <TableCell>Monthly subscription</TableCell>
                <TableCell>£12.00</TableCell>
                <TableCell><Badge variant="outline">Paid</Badge></TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" disabled>
                    <Download className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Dec 1, 2025</TableCell>
                <TableCell>Monthly subscription</TableCell>
                <TableCell>£12.00</TableCell>
                <TableCell><Badge variant="outline">Paid</Badge></TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" disabled>
                    <Download className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
