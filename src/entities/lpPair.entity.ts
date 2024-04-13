import { Entity, Column, OneToMany, Unique, OneToOne } from "typeorm";
import { BaseEntity } from "./base.entity";
import { TransactionEntity } from "./tx.entity";
import { NftPoolEntity } from "./nftPool.entity";

@Entity("lp_pairs")
@Unique(["address"])
@Unique(["token1_address", "token2_address"])
export class LpPairEntity extends BaseEntity {
	@Column()
	address: string;

	@Column({ name: "token1_address" })
	token1_address: string;

	@Column({ name: "token2_address" })
	token2_address: string;

	@OneToMany(() => TransactionEntity, (tx) => tx.lp_pair)
	transactions: TransactionEntity[];

	@OneToOne(() => NftPoolEntity, (nftPool) => nftPool.lp_pair)
	nft_pool: NftPoolEntity;
}
