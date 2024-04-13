import { Entity, Column, Unique, OneToOne, JoinColumn } from "typeorm";
import { BaseEntity } from "./base.entity";
import { NftPoolEntity } from "./nftPool.entity";

@Entity("thunder_pools")
@Unique(["address"])
export class ThunderPoolEntity extends BaseEntity {
	@Column()
	address: string;

	@OneToOne(() => NftPoolEntity, (nftPool) => nftPool.thunderPool, {
		onDelete: "CASCADE",
	})
	@JoinColumn({ name: "nft_pool_id", referencedColumnName: "id" })
	nft_pool: NftPoolEntity;

	@Column({ name: "nft_pool_id", nullable: true })
	nft_pool_id: string;

	@Column({ name: "is_lightning_pool", default: false })
	is_lightning_pool: boolean;
}
