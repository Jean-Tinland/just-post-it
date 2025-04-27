import Select from "jt-design-system/es/select";
import Checkbox from "jt-design-system/es/checkbox";
import { useAppContext } from "@/components/app-context";
import * as Actions from "@/app/actions";
import styles from "./preferences.module.css";

export default function Preferences() {
  const { user, preferences, setLoading } = useAppContext();
  const { theme, autoCorrect, spellCheck, hideKeyboardShortcuts } = preferences;

  const themeOptions = [
    { value: "auto", label: "System" },
    { value: "light", label: "Light" },
    { value: "dark", label: "Dark" },
  ];

  const updatePreference = (key: string) => async (value: boolean | string) => {
    setLoading(true);
    let convertedValue = value;
    if (typeof value === "boolean") {
      convertedValue = value ? "1" : "0";
    }
    await Actions.updatePreference(user.token, key, convertedValue as string);
    setLoading(false);
  };

  return (
    <div className={styles.container}>
      <Select
        label="Theme"
        className={styles.theme}
        value={theme}
        onValueChange={updatePreference("theme")}
        options={themeOptions}
        compact
      />
      <Checkbox
        checked={spellCheck === "1"}
        onCheckedChange={updatePreference("spellCheck")}
        label="Enable spell checking"
        appearance="switch"
      />
      <Checkbox
        checked={autoCorrect === "1"}
        onCheckedChange={updatePreference("autoCorrect")}
        label="Enable auto-correct"
        appearance="switch"
      />
      <Checkbox
        checked={hideKeyboardShortcuts === "1"}
        onCheckedChange={updatePreference("hideKeyboardShortcuts")}
        label="Hide keyboard shortcuts"
        appearance="switch"
      />
    </div>
  );
}
