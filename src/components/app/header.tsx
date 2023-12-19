import { useTranslation } from "react-i18next";

//
import { IoMdMenu } from "react-icons/io";

//
import languages from "../../data/availableLanguages.json";
import languageNames from "../../data/allLanguageNames.json";

//
interface IHeaderProps {
  onToggle: () => void;
}

/**
 *
 */
export default function Header(props: IHeaderProps) {
  const { i18n, t } = useTranslation();

  //
  const finalLanguageList =
    languages && Array.isArray(languages) ? languages : i18n.languages;

  //
  const getLanguageName = (lang: string) => {
    return (languageNames as Record<string, string>)[lang];
  };

  //
  return (
    <div className="sticky top-0 flex h-14 flex-shrink-0 items-center justify-between border-b border-gray-200 px-2 py-3 md:px-5 lg:px-10">
      <div className="flex gap-5">
        <button className="flex-shrink-0 lg:hidden" onClick={props.onToggle}>
          <IoMdMenu size={24} />
        </button>

        <div>{t("general.title")}</div>
      </div>

      <div>
        <select
          value={i18n.language}
          onChange={(e) => i18n.changeLanguage(e.target.value)}
          className="cursor-pointer select-none rounded py-1"
        >
          {finalLanguageList.map((lang) => (
            <option value={lang} key={lang}>
              {getLanguageName(lang)}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
