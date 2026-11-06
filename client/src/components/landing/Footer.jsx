import { Code2, Mail, ExternalLink } from "lucide-react";
import Logo from "../common/Logo";

const Footer = () => {
    return (
        <footer
            id="about"
            className="border-t border-slate-200 bg-white py-12 dark:border-slate-800 dark:bg-slate-950"
        >
            <div className="mx-auto max-w-7xl px-5 lg:px-8">
                <div className="flex flex-col items-center justify-between gap-8 md:flex-row">

                    <div>
                        <Logo />

                        <p className="mt-3 max-w-sm text-sm text-slate-500 dark:text-slate-400">
                            Empowering developers to think better, code smarter,
                            and achieve more.
                        </p>
                    </div>

                    <div className="flex items-center gap-4">
                        <a
                            href="https://github.com"
                            target="_blank"
                            rel="noreferrer"
                            aria-label="GitHub"
                            className="text-gray-500 transition hover:text-indigo-500"
                        >
                            <Code2 size={20} />
                        </a>

                        <a
                            href="mailto:hello@devquest.com"
                            aria-label="Email"
                            className="text-gray-500 transition hover:text-indigo-500"
                        >
                            <Mail size={20} />
                        </a>

                        <a
                            href="#features"
                            aria-label="Features"
                            className="text-gray-500 transition hover:text-indigo-500"
                        >
                            <ExternalLink size={20} />
                        </a>
                    </div>
                </div>

                <div className="mt-10 border-t border-slate-200 pt-7 text-center text-sm text-slate-500 dark:border-slate-800 dark:text-slate-500">
                    © {new Date().getFullYear()} DevQuest. Built for developers.
                </div>
            </div>
        </footer>
    );
};

export default Footer;