import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Role } from '@/types/auth';

/**
 * Redirects /dashboard (and any query params) to the role-specific dashboard.
 * Used as the Stripe checkout success_url target: /dashboard?checkout=success
 */
export default function DashboardRedirect() {
  const { session, isLoading } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    if (isLoading) return;

    const extra = searchParams.toString() ? `?${searchParams.toString()}` : '';

    if (!session) {
      navigate(`/login${extra}`, { replace: true });
      return;
    }

    const path =
      session.user.role === Role.TUTOR ? '/tutor/dashboard' : '/student/dashboard';
    navigate(`${path}${extra}`, { replace: true });
  }, [isLoading, session, navigate, searchParams]);

  return null;
}
