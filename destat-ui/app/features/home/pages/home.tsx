import { supabase } from "~/postgress/supaclient";

// before redering Home react component
// not run in client, but browser = backend
export async function loader() {
  console.log("hello");
  const { data } = await supabase().from("destat-test").select("*");
  console.log(data);
}

export default function Home() {
  return <div>Hello destat world</div>;
}
