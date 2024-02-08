// This contains utils/helpers that ONLY & ONLY SHOULD run on server
import { hash, compare } from "bcrypt";

export const hashPassword = async (data: string) => {
    return await hash(data, 10);
};

export const matchPassword = async (password: string, hash: string) => {
    return await compare(password, hash);
};

export enum emailTemplateNames {
    VERIFICATION_TEMPLATE = "VERIFICATION_TEMPLATE",
}

const emailTemplates: { name: string; html: string }[] = [
    {
        name: emailTemplateNames.VERIFICATION_TEMPLATE,
        html: '<div style= \"font-family: helvetica, sans-serif; margin: 0 auto; padding: 0 \" bgcolor= \"white \" > <center> <table class= \"m_-7388071199211216351container600 \" cellpadding= \"0 \" cellspacing= \"0 \" border= \"0 \" width= \"100% \" style= \" width: calc(600px); border-collapse: collapse; margin: 0 auto; padding: 0; \" > <tbody> <tr style= \"border-collapse: collapse; margin: 0; padding: 0 \"> <td width= \"100% \" style= \"border-collapse: collapse; margin: 0; padding: 0 \" > <table width= \"100% \" cellpadding= \"0 \" cellspacing= \"0 \" border= \"0 \" style= \" min-width: 100%; border-collapse: collapse; margin: 0; padding: 0; \" > <tbody> <tr style= \" border-collapse: collapse; margin: 0; padding: 0; \" > <td height= \"64 \" style= \" border-collapse: collapse; margin: 0; padding: 0; \" > &nbsp; </td> </tr> <tr style= \" border-collapse: collapse; margin: 0; padding: 0; \" align= \"center \" > <td style= \" border-collapse: collapse; margin: 0; padding: 0; \" > <p style= \" font-family: inter, sans-serif; text-decoration: none; color: #333; font-weight: 300; display: block; font-size: 42px; line-height: 24px; margin: 1em 0; padding: 0; \" > Patient <span style= \"color: #22C55E \" >Scheduler</span > </p> </td> </tr> <tr style= \" border-collapse: collapse; margin: 0; padding: 0; \" > <td width= \"100% \" style= \" min-width: 100%; border-collapse: collapse; margin: 0; padding: 0; \" > <center> <table style= \" border-collapse: collapse; text-align: left; margin: 20px 0 0; padding: 0; \" > <tbody> <tr style= \" border-collapse: collapse; margin: 0; padding: 0; \" > <td style= \" border-collapse: collapse; margin: 0; padding: 0 0 10px; \" > <table width= \"100% \" cellpadding= \"0 \" cellspacing= \"0 \" border= \"0 \" style= \" border-collapse: collapse; margin: 0; padding: 0; \" > <tbody> <tr valign= \"top \" style= \" border-collapse: collapse; margin: 0; padding: 0; \" > <td valign= \"top \" style= \" border-collapse: collapse; margin: 0; padding: 0 0 10px; \" > </td> <td valign= \"top \" style= \" border-collapse: collapse; margin: 0; padding: 0 15px 35px; \" > <div class= \"m_-7388071199211216351markdown-container \" > <h2 style= \" font-family: helvetica, sans-serif; text-decoration: none; color: #333; margin: 0; padding: 0; \" > <p style= \" font-family: helvetica, sans-serif; color: #22C55E; margin: 0; padding: 0; \" > Activate Your Sk1n Promenade Account </p> </h2> <p style= \" font-family: helvetica, sans-serif; text-decoration: none; color: #333; font-weight: 300; display: block; font-size: 15px; line-height: 24px; margin: 1em0; padding: 0; \" > By activating your account, you can start managing the Sk1n Promenade app. </p> <p style= \" font-family: helvetica, sans-serif; text-decoration: none; color: #333; font-weight: 300; display: block; font-size: 15px; line-height: 24px; margin: 1em0; padding: 0; \" > Click the Link below to activate your account </p> <p style= \" font-family: helvetica, sans-serif; text-decoration: none; color: #333; font-weight: 300; display: block; font-size: 15px; line-height: 24px; margin: 1em 0 0em; padding: 0; \"> <a href= \"${url} \" style= \" font-family: helvetica, sans-serif; text-decoration: underline; color: #22C55E; margin: 0; padding: 0; \" target= \"_blank \" data-saferedirecturl= \"${url} \">Activate Account</a> <span style= \" color: #59ACB3; font-family: helvetica, sans-serif; text-decoration: none; margin: 0; padding: 0; \" >■</span > </p> </div> </td> </tr> </tbody> </table> </td> </tr> </tbody> </table> </center> </td> </tr> </tbody> </table> </td> </tr> </tbody> </table> </center> </div>',
    },
];

export const getTemplate = (name: emailTemplateNames) => {
    let toreturn = "";
    emailTemplates.forEach((template) => {
        if (template.name === name) toreturn = template.html;
    });
    return toreturn;
};

export const transformer = (
    template: string,
    value: Record<string, any>
): string => {
    const regex = /\${(.*?)}/g;

    const interpolatedString = template.replace(regex, (_, match) => {
        const propertyValue = value[match.trim()];
        return propertyValue !== undefined ? propertyValue : "";
    });

    return interpolatedString;
};

export const isQueryParamValEqualTo = (url : string, paramKey : string, expected : string) => {
    return getQueryParamValue(url, paramKey) === expected
}

export const getQueryParamValue = (url : string, paramKey : string) => {
    return new URL(url).searchParams.get(paramKey)
}