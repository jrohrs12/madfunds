import FundCard from "@/components/FundCard";
import { useRouter } from "next/router";

export default function Fundraiser() {
  const router = useRouter();
  const getFund = async () => {
    const res = await fetch(`src/api/api.js?id=${router.query.id}`, {});
  };

  return (
    <div>
      <h1>{router.query.id}</h1>
      <FundCard />
    </div>
  );
}
