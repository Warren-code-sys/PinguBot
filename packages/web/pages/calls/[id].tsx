import { useRouter } from 'next/router';

export default function CallDetail() {
  const router = useRouter();
  const { id } = router.query;
  return <div>Call {id}</div>;
}
