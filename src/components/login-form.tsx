"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import Input from "dt-design-system/es/input";
import Button from "dt-design-system/es/button";
import { useSnackbar } from "dt-design-system/es/snackbar";
import { useAppContext } from "@/components/app-context";
import * as Actions from "@/app/actions";
import * as Cookies from "@/services/cookies";
import styles from "./login-form.module.css";

export default function LoginForm() {
  const router = useRouter();
  const { setLoading } = useAppContext();
  const snackbar = useSnackbar();

  const submitForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.currentTarget;
    const formData = new FormData(form);
    const password = formData.get("password")?.toString() || "";

    try {
      setLoading(true);
      const { error, token } = await Actions.login(password);
      if (error) {
        throw new Error(error);
      }
      Cookies.set("token", token, Number(process.env.JWT_DURATION));
      snackbar.show({ type: "success", message: "Logged in successfully" });
      router.push("/");
    } catch (e) {
      snackbar.show({ type: "error", message: "Login error", filler: false });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className={styles.form} onSubmit={submitForm}>
      <div className={styles.header}>
        <Image
          src="/images/logo.svg"
          width={40}
          height={40}
          alt="Just Post-It logo"
        />
        <h1 className={styles.title}>Just Post-It</h1>
      </div>
      <div className={styles.fields}>
        <Input
          className={styles.field}
          name="password"
          type="password"
          label="Password"
          compact
        />
      </div>
      <div className={styles.footer}>
        <Button type="submit" className={styles.button}>
          Login
        </Button>
      </div>
    </form>
  );
}
