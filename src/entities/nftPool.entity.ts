import { Entity, Column, Unique, OneToOne, JoinColumn } from "typeorm";
import { BaseEntity } from "./base.entity";
import { LpPairEntity } from "./lpPair.entity";
import { ThunderPoolEntity } from "./thunderPool.entity";

@Entity("nft_pools")
@Unique(["address"])
@Unique(["lp_address"])
export class NftPoolEntity extends BaseEntity {
	@Column()
	address: string;

	@OneToOne(() => LpPairEntity, (pair) => pair.nft_pool, {
		onDelete: "CASCADE",
	})
	@JoinColumn({ name: "pair_id", referencedColumnName: "id" })
	lp_pair: LpPairEntity;

	@Column({ name: "pair_id", nullable: true })
	pair_id: string;

	@OneToOne(() => ThunderPoolEntity, (thunderPool) => thunderPool.nft_pool)
	thunderPool: ThunderPoolEntity;

	@Column()
	lp_address: string;
}
