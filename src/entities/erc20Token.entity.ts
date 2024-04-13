import { Entity, Column, Unique } from "typeorm";
import { BaseEntity } from "./base.entity";

@Entity("erc20_tokens")
@Unique(["address"])
export class Erc20TokenEntity extends BaseEntity {
	@Column({ name: "address", length: 42 })
	address: string;

	@Column({ name: "name" })
	name: string;

	@Column({ name: "symbol" })
	symbol: string;

	@Column({ name: "decimals", type: "int" })
	decimals: number;

	@Column({ name: "logo_uri", type: "varchar", nullable: true })
	logo_uri: string;

	@Column({ name: "is_official", type: "boolean", default: false })
	is_official: boolean;
}
