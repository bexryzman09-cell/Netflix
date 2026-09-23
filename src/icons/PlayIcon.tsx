import type { SVGProps } from "react";

const SvgComponent = (props: SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={19} height={19} {...props}>
        <title>{"button-play-flat"}</title>
        <path
            fill="#8fbffa"
            fillRule="evenodd"
            d="M2.676.02a1.74 1.74 0 0 0-.845.218 1.64 1.64 0 0 0-.895 1.433v10.677a1.64 1.64 0 0 0 .895 1.433 1.74 1.74 0 0 0 1.718-.016l8.63-5.338a1.61 1.61 0 0 0-.001-2.876L3.548.253 3.532.244A1.74 1.74 0 0 0 2.676.02"
            clipRule="evenodd"
        />
    </svg>
);

export default SvgComponent;