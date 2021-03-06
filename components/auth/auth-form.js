import { useState, useRef } from "react";
import { signIn } from "next-auth/client";
import classes from "./auth-form.module.css";
import { useRouter } from "next/router";

async function createUser(email, password) {
	const response = await fetch("/api/auth/signup", {
		method: "POST",
		body: JSON.stringify({ email, password }),
		headers: {
			"Content-Type": "application/json",
		},
	});

	const data = await response.json();

	if (!response.ok) {
		throw new Error(data.message || "Something went wrong!");
	}
	return data;
}

function AuthForm() {
	const [isLogin, setIsLogin] = useState(true);
	const emailInputRef = useRef();
	const passowordInputRef = useRef();
	const router = useRouter();

	function switchAuthModeHandler() {
		setIsLogin((prevState) => !prevState);
	}

	function submitHandler(event) {
		event.preventDefault();

		const enteredEmail = emailInputRef.current.value;
		const enteredPassword = passowordInputRef.current.value;

		if (isLogin) {
			try {
				const result = await signIn("credentials", {
					redirect: false,
					email: enteredEmail,
					password: enteredEmail,
				});

				if (!result.error) {
					router.replace("/profile");
				}

				console.log(result);
			} catch (e) {
				console.log(e);
			}
			//
		} else {
			try {
				const result = await createUser(enteredEmail, enteredPassword);
			} catch (e) {
				console.log(e);
			}
		}
	}

	return (
		<section className={classes.auth}>
			<h1>{isLogin ? "Login" : "Sign Up"}</h1>
			<form onSubmit={submitHandler}>
				<div className={classes.control}>
					<label htmlFor="email">Your Email</label>
					<input ref={emailInputRef} type="email" id="email" required />
				</div>
				<div className={classes.control}>
					<label htmlFor="password">Your Password</label>
					<input
						ref={passowordInputRef}
						type="password"
						id="password"
						required
					/>
				</div>
				<div className={classes.actions}>
					<button>{isLogin ? "Login" : "Create Account"}</button>
					<button
						type="button"
						className={classes.toggle}
						onClick={switchAuthModeHandler}
					>
						{isLogin ? "Create new account" : "Login with existing account"}
					</button>
				</div>
			</form>
		</section>
	);
}

export default AuthForm;
