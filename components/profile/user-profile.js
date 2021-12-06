// import { useSession, getSession } from "next-auth/client";
// import { useState, useEffect } from "react";
import ProfileForm from "./profile-form";
import classes from "./user-profile.module.css";

function UserProfile() {
	// Redirect away if NOT auth

	// const [isLoading, setIsLoading] = useState(true);
	// const [loadedSession, setLoadedSession] = useState();
	// // const [session, loading] = useSession();

	// useEffect(() => {
	// 	getSession()
	// 		.then((session) => {
	// 			if (!session) {
	// 				window.location.href = "/auth";
	// 			}

	// 			setIsLoading(false);
	// 		})
	// 		.catch((e) => console.log(e));
	// }, []);

	// if (isLoading) {
	// 	return <p className={classes.profile}> Loading</p>;
	// }

	async function changePasswordHandler(passwordData) {
		try {
			const response = await fetch("/api/user/change-password", {
				method: "PATCH",
				body: JSON.stringify(passwordData),
				headers: {
					"Content-Type": "application/json",
				},
			});

			const data = await response.json();
			console.log(data);
		} catch (e) {
			console.log(e);
			throw new Error(e.message || "Something went wrong");
		}
	}

	return (
		<section className={classes.profile}>
			<h1>Your User Profile</h1>
			<ProfileForm onChangePassword={changePasswordHandler} />
		</section>
	);
}

export default UserProfile;
