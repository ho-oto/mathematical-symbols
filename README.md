# mathematical-symbols README

Mathematical Symbols is an extension that supports the input of mathematical symbols that exist in Unicode.

Type the command after `\` and then press the trigger key (tab/space) to perform the conversion (e.g. `\alpha<tab>` -> `α`)

The command definitions are similar to LaTeX, but include many abbreviations (e.g. `\Ga<tab>` -> `Γ`) and ASCII art-based commands (e.g. `=>` -> `⇒`).

In exchange, the range of symbols available is limited to those considered frequently used.

Refer to `src/data.ts` for a complete list of commands.

## Batch Conversion

The characters `_`, `^`, `;`, and `,` have special effects.

- `\_a`, `\a_`, and `\_a_` all represent the subscript `ₐ`.
- `\^a`, `\a^`, and `\^a^` all represent the superscript `ᵃ`.

Using `^` and `_`, multiple characters can be converted in one go, e.g., `\^abc` -> `ᵃᵇᶜ`.

Since Unicode only supports a limited set of superscript and subscript characters, some letters cannot be converted.

Commands in the form `\{style};{sequence}` allow you to specify styles (e.g., bold, italic, fraktur) and apply them to the sequence.

For example: `\b;abc<tab>` -> `𝐚𝐛𝐜`.

The following table lists supported styles:

| style | prefix | example |
| ----- | ---- | --------- |
| bold  | b | 𝐚𝐛𝐜 |
| italic | i | 𝑎𝑏𝑐 |
| blackboard | bb, B | 𝕒𝕓𝕔 |
| calligraphy | c | 𝒶𝒷𝒸 |
| fraktur | f | 𝔞𝔟𝔠 |
| serif | s | 𝖺𝖻𝖼 |
| mono-space | t | 𝚊𝚋𝚌 |
| superscript | ^, u | ᵃᵇᶜ |
| subscript | _, d | ₁₂₃ |

Some styles can be combined, such as `\bi;abc` -> `𝒂𝒃𝒄` (bold + italic).
If a combination is not possible, the first style takes precedence.

Commands can be chained using `,` for batch conversion.

For example: `\alpha,b;foo,_x,gamma<tab>` -> `α𝐟𝐨𝐨ₓγ`.

The behavior of batch conversion changes depending on the trigger key:

When triggered with a space, spaces are inserted between the converted characters.

## Negation

To negate a character, input `\!a` or `\a!`.
This uses Unicode combining marks to produce `a̸`.

If precomposed Unicode characters exist, they take priority:

- `\!=` -> `≠`
- `\!in` -> `∉`

## LICENSE

MIT
