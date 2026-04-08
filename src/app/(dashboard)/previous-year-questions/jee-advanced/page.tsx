import { redirect } from 'next/navigation';

export default function JeeAdvancedRedirect() {
  // Permanently redirect users away from this middleman page back to the root tabbed UI
  redirect('/previous-year-questions');
}