import type { SVGProps } from "react";

const SvgComponent = (props: SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={20} height={20} {...props}>
        <title>{"yes"}</title>
        <path
            fill="currentColor"
            d="m14.83 4.89 1.34.94-5.81 8.38H9.02L5.78 9.67l1.34-1.25 2.57 2.4z"
        />
    </svg>
);

export default SvgComponent;