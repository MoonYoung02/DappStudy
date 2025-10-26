import { supabase } from "~/postgress/supaclient";

export async function loader() {
  const { data } = await supabase().from("destat-test").select("*");
}

export default function Dashboard() {
  return <div>Hello destat world</div>;
}
