import { BookingForm } from '@/features/booking/booking-form';

export default async function BookingPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  return (
    <main className="min-h-screen bg-muted/40 pb-20 px-4 md:px-0">
      <div className="container mx-auto pt-10">
        <BookingForm slug={slug} />
      </div>
    </main>
  );
}
