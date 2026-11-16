import ConfirmationClient from './ConfirmationClient';

export default async function ConfirmationPage({ params }: { params: Promise<{ reference: string }> }) {
  const { reference } = await params;
  return <ConfirmationClient reference={reference} />;
}