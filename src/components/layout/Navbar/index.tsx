import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import NavbarClient from "./NavbarClient";

const Navbar = async () => {
	const supabase = createServerComponentClient({ cookies: () => cookies() });
	const {
		data: { user },
	} = await supabase.auth.getUser();

	return <NavbarClient user={user} />;
};

export default Navbar;
