export type MigratedContactFormConfig = {
  variant: string;
  title: string;
  buttonLabel: string;
  showMessage?: boolean;
  showPromoCode?: boolean;
  messageAsSingleLine?: boolean;
  placement: "before-content" | "after-content";
};

const formsByPath: Record<string, MigratedContactFormConfig[]> = {
  "/formulario-contacto/": [
    {
      variant: "renting-interest",
      title: "Disfruta de todas las ventajas que te ofrece la modalidad de renting",
      buttonLabel: "¡Me interesa!",
      showMessage: true,
      messageAsSingleLine: true,
      placement: "before-content",
    },
    {
      variant: "callback",
      title: "Déjanos tus datos de contacto y nosotros te llamamos",
      buttonLabel: "Quiero que me contacten",
      showMessage: true,
      messageAsSingleLine: true,
      placement: "after-content",
    },
  ],
  "/informate-sin-compromiso/": [
    {
      variant: "no-obligation-promo",
      title: "El Renting es el futuro... ¡no te quedes atrás!",
      buttonLabel: "Enviar",
      showPromoCode: true,
      showMessage: false,
      placement: "before-content",
    },
  ],
  "/contacto-email3/": [
    {
      variant: "info-promo",
      title: "INFÓRMATE SIN COMPROMISO",
      buttonLabel: "Enviar",
      showPromoCode: true,
      showMessage: false,
      placement: "before-content",
    },
  ],
  "/contacto-email/": [
    {
      variant: "callback-email",
      title: "Déjanos tus datos de contacto y nosotros te llamamos",
      buttonLabel: "Quiero que me contacten",
      showMessage: true,
      placement: "before-content",
    },
  ],
  "/contacto/": [
    {
      variant: "contact",
      title: "Contacto",
      buttonLabel: "Enviar",
      showMessage: true,
      placement: "before-content",
    },
  ],
};

export function getMigratedContactForms(sourcePath: string) {
  return formsByPath[sourcePath] ?? [];
}

export function getMigratedContactFormPaths() {
  return Object.keys(formsByPath);
}
