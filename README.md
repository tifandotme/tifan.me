# tifan.me

My personal website.

## Development

Use Vite+ 1.3.0 with Node.js 24.11 or newer on the Node.js 24 release line.
Bun 1.4.4 manages dependencies only; Node.js runs the tools and application.

```sh
vp install --frozen-lockfile
vp run dev
vp check
vp test run
vp run build
vp run start
```

Lint, format, and test settings live in `vite.config.ts`. `vp check` includes
type-aware linting and type checking. Use `vp run dev` and `vp run build` for
Next.js; the built-in `vp dev` and `vp build` commands run Vite instead.

## License

All blog posts are licensed under [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/)<br>
Source code is licensed under [MIT](https://github.com/tifandotme/tifan.me/blob/master/LICENSE)
