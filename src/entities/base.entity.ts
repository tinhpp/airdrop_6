import {
	CreateDateColumn,
	DeleteDateColumn,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from "typeorm";
import { Exclude } from "class-transformer";

export abstract class BaseEntity {
	@PrimaryGeneratedColumn()
	id: string;

	@Exclude()
	@CreateDateColumn({ type: "timestamp" })
	created_at: Date;

	@Exclude()
	@UpdateDateColumn({ type: "timestamp" })
	updated_at: Date;

	@Exclude()
	@DeleteDateColumn({ type: "timestamp" })
	deleted_at: Date;
}
