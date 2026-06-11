import React from "react";

interface ConsentSectionProps {
  consentGiven: boolean;
  onConsentChange: (value: boolean) => void;
}

export default function ConsentSection({
  consentGiven,
  onConsentChange,
}: ConsentSectionProps) {
  return (
    <div className="flex items-start p-4 bg-gray-50 rounded-xl border border-gray-200">
      <input
        type="checkbox"
        id="consent-checkbox"
        className="mt-1 mr-3 h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        checked={consentGiven}
        onChange={(e) => onConsentChange(e.target.checked)}
      />
      <label htmlFor="consent-checkbox" className="text-gray-700">
        <span className="block font-medium">Confirmo mi consentimiento</span>
        <span className="block text-sm">
          Acepto el tratamiento de mis datos personales según lo establecido en
          la{" "}
          <a
            href="https://www.canva.com/design/DAGnccU5tkw/x9QLqfr8057IgwHGv5sScA/view?utm_content=DAGnccU5tkw&utm_campaign=designshare&utm_medium=link2&utm_source=uniquelinks&utlId=hb87bcf2817"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 underline"
          >
            política de protección de datos
          </a>{" "}
          y confirmo que toda la información proporcionada es verídica.
        </span>
      </label>
    </div>
  );
}
