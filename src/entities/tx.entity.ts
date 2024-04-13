import { Entity, Column, ManyToOne, Unique, JoinColumn } from "typeorm";
import { BaseEntity } from "./base.entity";
import { LpPairEntity } from "./lpPair.entity";

@Entity("transactions")
@Unique(["tx_hash"])
export class TransactionEntity extends BaseEntity {
	@Column({ name: "tx_hash" })
	tx_hash: string;

	@Column({ name: "token1_amount" })
	token1_amount: string;

	@Column({ name: "token2_amount" })
	token2_amount: string;

	@ManyToOne(() => LpPairEntity, (pair) => pair.transactions, {
		onDelete: "CASCADE",
	})
	@JoinColumn({ name: "pair_id", referencedColumnName: "id" })
	lp_pair: LpPairEntity;

	@Column({ name: "pair_id" })
	pair_id: string;
}
