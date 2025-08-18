import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import HeaderClient from "./HeaderClient";

const Header = async () => {
	const supabase = createServerComponentClient({ cookies });
	const {
		data: { user },
	} = await supabase.auth.getUser();

	return <HeaderClient user={user} />;
};

export default Header;
