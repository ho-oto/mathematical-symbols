import { subs, sups } from "./data";

export function generateAlphanumericData() {
    const bf: Record<string, string> = {};
    const it: Record<string, string> = {};
    const itbf: Record<string, string> = {};
    const scr: Record<string, string> = {};
    const scrbf: Record<string, string> = {};
    const frak: Record<string, string> = {};
    const frakbf: Record<string, string> = {};
    const bb: Record<string, string> = {};
    const sf: Record<string, string> = {};
    const sfit: Record<string, string> = {};
    const sfbf: Record<string, string> = {};
    const sfbfit: Record<string, string> = {};
    const tt: Record<string, string> = {};

    for (let cp = "A".charCodeAt(0); cp <= "Z".charCodeAt(0); cp++) {
        const key = String.fromCodePoint(cp);
        bf[key] = String.fromCodePoint(cp + 119743); // '𝐀' - 'A' == 119743
        it[key] = String.fromCodePoint(cp + 119795); // '𝐴' - 'A' == 119795
        itbf[key] = String.fromCodePoint(cp + 119847); // '𝑨' - 'A' == 119847
        scr[key] = String.fromCodePoint(cp + 119899); // '𝒜' - 'A' == 119899
        scrbf[key] = String.fromCodePoint(cp + 119951); // '𝓐' - 'A' == 119951
        frak[key] = String.fromCodePoint(cp + 120003); // '𝔄' - 'A' == 120003
        frakbf[key] = String.fromCodePoint(cp + 120107); // '𝕬' - 'A' == 120107
        bb[key] = String.fromCodePoint(cp + 120055); // '𝔸' - 'A' == 120055
        sf[key] = String.fromCodePoint(cp + 120159); // '𝖠' - 'A' == 120159
        sfbf[key] = String.fromCodePoint(cp + 120211); // '𝗔' - 'A' == 120211
        sfit[key] = String.fromCodePoint(cp + 120263); // '𝘈' - 'A' == 120263
        sfbfit[key] = String.fromCodePoint(cp + 120315); // '𝘼' - 'A' == 120315
        tt[key] = String.fromCodePoint(cp + 120367); // '𝙰' - 'A' == 120367
    }

    for (let cp = "a".charCodeAt(0); cp <= "z".charCodeAt(0); cp++) {
        const key = String.fromCodePoint(cp);
        bf[key] = String.fromCodePoint(cp + 119737); // '𝐚' - 'a' == 119737
        it[key] = String.fromCodePoint(cp + 119789); // '𝑎' - 'a' == 119789
        itbf[key] = String.fromCodePoint(cp + 119841); // '𝒂' - 'a' == 119841
        scr[key] = String.fromCodePoint(cp + 119893); // '𝒶' - 'a' == 119893
        scrbf[key] = String.fromCodePoint(cp + 119945); // '𝓪' - 'a' == 119945
        frak[key] = String.fromCodePoint(cp + 119997); // '𝔞' - 'a' == 119997
        frakbf[key] = String.fromCodePoint(cp + 120101); // '𝖆' - 'a' == 120101
        bb[key] = String.fromCodePoint(cp + 120049); // '𝕒' - 'a' == 120049
        sf[key] = String.fromCodePoint(cp + 120153); // '𝖺' - 'a' == 120153
        sfbf[key] = String.fromCodePoint(cp + 120205); // '𝗮' - 'a' == 120205
        sfit[key] = String.fromCodePoint(cp + 120257); // '𝘢' - 'a' == 120257
        sfbfit[key] = String.fromCodePoint(cp + 120309); // '𝙖' - 'a' == 120309
        tt[key] = String.fromCodePoint(cp + 120361); // '𝚊' - 'a' == 120361
    }

    for (let cp = "0".charCodeAt(0); cp <= "9".charCodeAt(0); cp++) {
        const key = String.fromCodePoint(cp);
        bf[key] = String.fromCodePoint(cp + 120734); // '𝟎' - '0' == 120734
        it[key] = key;
        itbf[key] = bf[key];
        scr[key] = key;
        scrbf[key] = bf[key];
        frak[key] = key;
        frakbf[key] = bf[key];
        bb[key] = String.fromCodePoint(cp + 120744); // '𝟘' - '0' == 120744
        sf[key] = String.fromCodePoint(cp + 120754); // '𝟢' - '0' == 120754
        sfbf[key] = String.fromCodePoint(cp + 120764); // '𝟬' - '0' == 120764
        sfit[key] = sf[key];
        sfbfit[key] = sfbf[key];
        tt[key] = String.fromCodePoint(cp + 120774); // '𝟶' - '0' == 120774
    }

    it["h"] = "ℎ";

    scr["B"] = "ℬ";
    scr["E"] = "ℰ";
    scr["F"] = "ℱ";
    scr["H"] = "ℋ";
    scr["I"] = "ℐ";
    scr["L"] = "ℒ";
    scr["M"] = "ℳ";
    scr["R"] = "ℛ";
    scr["e"] = "ℯ";
    scr["g"] = "ℊ";
    scr["o"] = "ℴ";

    frak["C"] = "ℭ";
    frak["H"] = "ℌ";
    frak["I"] = "ℑ";
    frak["R"] = "ℜ";
    frak["Z"] = "ℨ";

    bb["C"] = "ℂ";
    bb["H"] = "ℍ";
    bb["N"] = "ℕ";
    bb["P"] = "ℙ";
    bb["Q"] = "ℚ";
    bb["R"] = "ℝ";
    bb["Z"] = "ℤ";

    const prefixSymbolTableData: Record<string, Record<string, string>> = {};
    const alphanumerics: Record<string, string> = {};

    for (const { map, prefix, kind } of [
        { map: bf, prefix: ["b"], kind: ["bf"] },
        { map: it, prefix: ["i"], kind: ["it"] },
        { map: itbf, prefix: ["ib", "bi"], kind: ["itbf", "bfit"] },
        { map: scr, prefix: ["c"], kind: ["cal", "scr"] },
        {
            map: scrbf,
            prefix: ["cb", "bc"],
            kind: ["calbf", "scrbf", "bfscr", "bfcal"],
        },
        { map: frak, prefix: ["f"], kind: ["frak", "frk"] },
        {
            map: frakbf,
            prefix: ["fb", "bf"],
            kind: ["frakbf", "frkbf", "bffrak", "bffrk"],
        },
        { map: bb, prefix: ["B", "bb"], kind: ["bb"] },
        { map: sf, prefix: ["s"], kind: ["sf"] },
        { map: sfit, prefix: ["si", "is"], kind: ["sfit", "itsf"] },
        { map: sfbf, prefix: ["sb", "bs"], kind: ["sfbf", "bfsf"] },
        {
            map: sfbfit,
            prefix: ["sbi", "sib", "bsi", "bis", "isb", "ibs"],
            kind: ["sfbfit", "sfitbf", "bfsfit", "bfitsf", "itsfbf", "itbfsf"],
        },
        { map: tt, prefix: ["t"], kind: ["tt"] },
        { map: sups, prefix: ["u", "^"], kind: ["sup", "^"] },
        { map: subs, prefix: ["d", "_"], kind: ["sub", "_"] },
    ]) {
        for (const p of prefix) {
            prefixSymbolTableData[p] = map;
        }
        for (const [k, v] of Object.entries(map)) {
            for (const d of kind) {
                for (const key of [`${d}${k}`, `${k}${d}`]) {
                    if (!(key in alphanumerics)) {
                        alphanumerics[key] = v;
                    }
                }
            }
        }
    }

    return { alphanumerics, prefixSymbolTableData };
}
