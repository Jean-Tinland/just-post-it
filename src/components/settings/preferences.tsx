import Select from "jt-design-system/es/select";
import Input from "jt-design-system/es/input";
import Checkbox from "jt-design-system/es/checkbox";
import { useAppContext } from "@/components/app-context";
import * as PreferencesService from "@/services/preferences";
import styles from "./preferences.module.css";

export default function Preferences() {
  const { preferences, updatePreferences } = useAppContext();
  const { theme, autoCorrect, spellCheck, hideKeyboardShortcuts, fontFamily } =
    preferences;

  const themeOptions = [
    { value: "auto", label: "System" },
    { value: "light", label: "Light" },
    { value: "dark", label: "Dark" },
  ];

  const updatePreference = (key: string) => (value: boolean | string) => {
    PreferencesService.updatePreference(key as keyof typeof preferences, value);
    const updated = PreferencesService.getPreferences();
    updatePreferences(updated);
  };

  return (
    <div className={styles.container}>
      <Select
        label="Theme"
        className={styles.field}
        value={theme}
        onValueChange={updatePreference("theme")}
        options={themeOptions}
        compact
      />
      <Input
        label="Font family"
        className={styles.field}
        defaultValue={fontFamily}
        onBlur={(e) => updatePreference("fontFamily")(e.target.value)}
        compact
      />
      <Checkbox
        checked={spellCheck}
        onCheckedChange={updatePreference("spellCheck")}
        label="Enable spell checking"
        appearance="switch"
      />
      <Checkbox
        checked={autoCorrect}
        onCheckedChange={updatePreference("autoCorrect")}
        label="Enable auto-correct"
        appearance="switch"
      />
      <Checkbox
        checked={hideKeyboardShortcuts}
        onCheckedChange={updatePreference("hideKeyboardShortcuts")}
        label="Hide keyboard shortcuts"
        appearance="switch"
      />
    </div>
  );
}
