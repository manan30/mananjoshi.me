import cn from "clsx";
import { BriefcaseBusiness, GraduationCap } from "lucide-react";
import React from "react";

export const iconMapping = {
	work: "work",
	education: "education",
} as const;

export type IconType = keyof typeof iconMapping;

type IconProps = {
	icon: IconType;
	className?: string;
};

export function Icon({ icon, className }: IconProps) {
	switch (iconMapping[icon]) {
		case "work":
			return (
				<BriefcaseBusiness
					className={cn("h-[0.85rem] w-[0.85rem] stroke-white", className)}
				/>
			);
		case "education":
			return (
				<GraduationCap className={cn("h-4 w-4 stroke-white", className)} />
			);
		default:
			throw new Error(`Invalid icon type: ${icon}`);
	}
}
