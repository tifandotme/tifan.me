import type { Metadata } from "next"
import { slugify } from "../../_lib/utils"
import projects from "./data"
import { Projects } from "./projects"

export const metadata: Metadata = {
  title: "Projects",
}

export default function ProjectsPage() {
  return (
    <>
      <article className="container-md mb-10 space-y-5 [&_p]:text-[105%]">
        <h1 className="text-xl font-bold">Open Source</h1>
        <p>
          Whether it&apos;s a personal passion project or a practical solution
          to everyday problems, I see these open-source projects as creative
          vessels for exploring and learning new topics.
        </p>
      </article>

      <section className="bg-slate-700 py-10 text-white selection:text-black dark:bg-slate-400 dark:text-black dark:selection:bg-slate-700 dark:selection:text-white">
        <div className="container-md">
          <p className="mb-3.5 text-lg font-semibold">Table of Contents</p>
          <ul>
            {projects
              .toSorted((a, b) => Intl.Collator().compare(a.name, b.name))
              .map((project) => (
                <li key={project.name}>
                  <a
                    href={`#${slugify(project.name)}`}
                    className="-mx-2 block w-fit cursor-default px-2 py-1 whitespace-nowrap text-inherit hover:underline hover:underline-offset-1 sm:py-0.5"
                  >
                    {project.name}
                  </a>
                </li>
              ))}
          </ul>
        </div>
      </section>

      <Projects />
    </>
  )
}
