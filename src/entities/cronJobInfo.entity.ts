import { Entity, Column } from "typeorm";
import { BaseEntity } from "./base.entity";

@Entity("cronjob_info")
export class CronjobInfoEntity extends BaseEntity {
	@Column({ name: "last_block_num" })
	last_block_num: number;
}
