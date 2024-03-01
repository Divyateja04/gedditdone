import { SVGProps } from "react";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

export type Post = {
  author: User;
  source: string;
  destination: string;
  service: string;
  costInPoints: number;
}

export type User = {
  userId: number;
  name: string;
  email: string;
  password: string;
  karmapoints: number;
  phoneNumber: string;
  karmaPoints: number;
}