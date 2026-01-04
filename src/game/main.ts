import Phaser from 'phaser';
import { portals, type PortalConfig } from './portals';
const TILE_SIZE = 16;
const ROOM_WIDTH = TILE_SIZE * 24;
const ROOM_HEIGHT = TILE_SIZE * 16;
const mapParam =
	typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('map') : null;
const mapFile =
	mapParam === 'alt'
		? 'room-alt.tmj'
		: mapParam === 'cute'
			? 'room-cute.tmj'
			: mapParam === 'cute-rich'
				? 'room-cute-rich.tmj'
				: 'room-cute-rich.tmj';
const shadersEnabled =
	typeof window !== 'undefined'
		? new URLSearchParams(window.location.search).get('fx') !== 'off'
		: false;
const PLAYER_SPEED = 90;
const PROXIMITY_RADIUS = 44;

const baseUrl = import.meta.env.BASE_URL ?? '/';

const resolveUrl = (url: string) => {
	if (!url) {
		return baseUrl;
	}
	if (url.startsWith('http')) {
		return url;
	}
	return `${baseUrl}${url.replace(/^\//, '')}`;
};

class DungeonScene extends Phaser.Scene {
	private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
	private wasd!: Record<string, Phaser.Input.Keyboard.Key>;
	private spaceKey!: Phaser.Input.Keyboard.Key;
	private player!: Phaser.Physics.Arcade.Sprite;
	private portalSprites: Phaser.Physics.Arcade.Sprite[] = [];
	private projectiles!: Phaser.Physics.Arcade.Group;
	private lastDirection = 'down';
	private entering = false;
	private tileSize = TILE_SIZE;
	private mapPath = `${baseUrl}assets/${mapFile}`;
	private decorHitboxes?: Phaser.Physics.Arcade.StaticGroup;

	constructor() {
		super('dungeon');
	}

	preload() {
		this.load.spritesheet('player', `${baseUrl}assets/player.png`, {
			frameWidth: 16,
			frameHeight: 18,
		});
		this.load.spritesheet('portal', `${baseUrl}assets/portal.png`, {
			frameWidth: 64,
			frameHeight: 64,
		});
		this.load.image('tiles', `${baseUrl}assets/tiles.png`);
		this.load.image('tile-dungeon', `${baseUrl}assets/tiled/Tile Dungeon.png`);
		this.load.tilemapTiledJSON('room', this.mapPath);
		this.load.spritesheet('fireball', `${baseUrl}assets/fireball.png`, {
			frameWidth: 16,
			frameHeight: 16,
		});
		this.load.image('bookshelf-01', `${baseUrl}assets/decor/bookshelf-01.png`);
		this.load.image('bookshelf-02', `${baseUrl}assets/decor/bookshelf-02.png`);
		this.load.image('book-red', `${baseUrl}assets/decor/book-red.png`);
		this.load.image('pile-books', `${baseUrl}assets/decor/pile-books.png`);
		this.load.image('lamp', `${baseUrl}assets/decor/lamp.png`);
		this.load.image('lamp-big', `${baseUrl}assets/decor/lamp-big.png`);
		this.load.image('door', `${baseUrl}assets/decor/door.png`);
		// Load dungeon objects spritesheet (144x96, 9x6 grid of 16x16 tiles)
		this.load.spritesheet('dungeon-objects', `${baseUrl}assets/decor/dungeon-objects.png`, {
			frameWidth: 16,
			frameHeight: 16,
		});

		// Cute Fantasy Dungeon assets
		this.load.spritesheet('cute-dungeon-objects', `${baseUrl}assets/cute-fantasy/dungeon-objects.png`, {
			frameWidth: 16,
			frameHeight: 16,
		});
		this.load.spritesheet('cute-floor-spikes', `${baseUrl}assets/cute-fantasy/Floor_spikes_1.png`, {
			frameWidth: 16,
			frameHeight: 16,
		});
		this.load.spritesheet('cute-arch-small', `${baseUrl}assets/cute-fantasy/Dungeon_2_Arch_small.png`, {
			frameWidth: 16,
			frameHeight: 16,
		});
		this.load.spritesheet('cute-pillars', `${baseUrl}assets/cute-fantasy/pillars.png`, {
			frameWidth: 16,
			frameHeight: 16,
		});
		this.load.image('cute-fantasy-tileset', `${baseUrl}assets/cute-fantasy/dungeon-tileset.png`);
		this.load.image('door-closed', `${baseUrl}assets/cute-fantasy/door-closed.png`);
		this.load.image('door-open', `${baseUrl}assets/cute-fantasy/door-open.png`);
		this.load.image('arch', `${baseUrl}assets/cute-fantasy/arch.png`);
		this.load.image('arch-open', `${baseUrl}assets/cute-fantasy/arch-open.png`);
		this.load.image('gate-closed', `${baseUrl}assets/cute-fantasy/gate-closed.png`);
		this.load.image('gate-open', `${baseUrl}assets/cute-fantasy/gate-open.png`);
		this.load.spritesheet('gold-piles', `${baseUrl}assets/cute-fantasy/gold-piles.png`, {
			frameWidth: 16,
			frameHeight: 16,
		});
		this.load.spritesheet('pillars', `${baseUrl}assets/cute-fantasy/pillars.png`, {
			frameWidth: 16,
			frameHeight: 16,
		});
	}

	create() {
		this.cameras.main.setBackgroundColor('#05020a');

		const map = this.make.tilemap({ key: 'room' });
		this.tileSize = map.tileWidth || TILE_SIZE;
		const tilesetNames = map.tilesets.map((tileset) => tileset.name);
		let tileset: Phaser.Tilemaps.Tileset | null = null;
		if (tilesetNames.includes('dungeon')) {
			tileset = map.addTilesetImage('dungeon', 'tiles');
		} else if (tilesetNames.includes('Tile Dungeon')) {
			tileset = map.addTilesetImage('Tile Dungeon', 'tile-dungeon');
		} else if (tilesetNames.includes('cute-fantasy')) {
			tileset = map.addTilesetImage('cute-fantasy', 'cute-fantasy-tileset');
		} else if (map.tilesets[0]) {
			tileset = map.addTilesetImage(map.tilesets[0].name, 'tiles');
		}
		if (!tileset) {
			return;
		}
		const layerData =
			map.layers.find((layer) => layer.name === 'Room') ??
			map.layers.find((layer) => layer.name === 'Tile Layer 1') ??
			map.layers.find((layer) => layer.type === 'tilelayer');
		const layer = layerData ? map.createLayer(layerData.name, tileset, 0, 0) : null;
		layer?.setCollisionByProperty({ collides: true });

		const roomWidth = map.widthInPixels;
		const roomHeight = map.heightInPixels;
		this.physics.world.setBounds(0, 0, roomWidth, roomHeight);

		const spawn = map.getObjectLayer('Spawn')?.objects.find((obj) => obj.name === 'player');
		const spawnX = (spawn?.x ?? roomWidth / 2) + this.tileSize / 2;
		const spawnY = (spawn?.y ?? roomHeight / 2) + this.tileSize / 2;

		this.player = this.physics.add
			.sprite(spawnX, spawnY, 'player', 0)
			.setDepth(2);
		this.player.setCollideWorldBounds(true);
		this.player.body.setSize(10, 12).setOffset(3, 4);

		this.cursors = this.input.keyboard.createCursorKeys();
		this.wasd = this.input.keyboard.addKeys('W,A,S,D') as Record<
			string,
			Phaser.Input.Keyboard.Key
		>;
		this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

		this.createAnimations();

		if (layer) {
			this.physics.add.collider(this.player, layer);
		}
		this.projectiles = this.physics.add.group();
		if (layer) {
			this.physics.add.collider(this.projectiles, layer, (projectile) => {
				projectile.destroy();
			});
		}

		this.createDecor(map);

		const mapPortals = this.getPortalsFromMap(map);
		const portalList = mapPortals.length ? mapPortals : portals;
		this.portalSprites = portalList.map((portal) => this.createPortal(portal));

		this.cameras.main.setBounds(0, 0, roomWidth, roomHeight);
		this.cameras.main.centerOn(roomWidth / 2, roomHeight / 2);
		this.fitCameraToMap(roomWidth, roomHeight);
		this.scale.on('resize', () => this.fitCameraToMap(roomWidth, roomHeight));

		const title = this.add
			.text(roomWidth / 2, 18, 'Cassandra Dungeon', {
				fontFamily: '"Press Start 2P", monospace',
				fontSize: '10px',
				color: '#e6c2ff',
			})
			.setOrigin(0.5)
			.setDepth(5);
		this.tweens.add({
			targets: title,
			alpha: 0,
			duration: 1200,
			delay: 900,
			ease: 'Quad.easeOut',
		});
	}

	update() {
		if (this.entering) {
			this.player.setVelocity(0, 0);
			return;
		}

		const left = this.cursors.left.isDown || this.wasd.A.isDown;
		const right = this.cursors.right.isDown || this.wasd.D.isDown;
		const up = this.cursors.up.isDown || this.wasd.W.isDown;
		const down = this.cursors.down.isDown || this.wasd.S.isDown;

		let vx = 0;
		let vy = 0;
		if (left) {
			vx = -PLAYER_SPEED;
			this.lastDirection = 'left';
		} else if (right) {
			vx = PLAYER_SPEED;
			this.lastDirection = 'right';
		}
		if (up) {
			vy = -PLAYER_SPEED;
			this.lastDirection = 'up';
		} else if (down) {
			vy = PLAYER_SPEED;
			this.lastDirection = 'down';
		}

		if (vx !== 0 && vy !== 0) {
			vx *= 0.7071;
			vy *= 0.7071;
		}

		this.player.setVelocity(vx, vy);

		if (vx === 0 && vy === 0) {
			this.player.anims.stop();
			this.setIdleFrame();
		} else {
			this.playWalkAnimation();
		}

		this.updatePortalProximity();

		if (Phaser.Input.Keyboard.JustDown(this.spaceKey)) {
			this.shootProjectile();
		}
	}

	private createAnimations() {
		this.anims.create({
			key: 'walk',
			frames: this.anims.generateFrameNumbers('player', { start: 0, end: 4 }),
			frameRate: 8,
			repeat: -1,
		});
		this.anims.create({
			key: 'portal-idle',
			frames: this.anims.generateFrameNumbers('portal', { start: 0, end: 7 }),
			frameRate: 8,
			repeat: -1,
		});
		this.anims.create({
			key: 'portal-burst',
			frames: this.anims.generateFrameNumbers('portal', { start: 0, end: 7 }),
			frameRate: 16,
			repeat: 0,
		});
		this.anims.create({
			key: 'fireball-loop',
			frames: this.anims.generateFrameNumbers('fireball', { start: 0, end: 11 }),
			frameRate: 10,
			repeat: -1,
		});
	}

	private createPortal(portal: PortalConfig) {
		const sprite = this.physics.add
			.sprite(portal.x, portal.y, 'portal', 0)
			.setDepth(1)
			.setScale(0.5)
			.setData('portal', portal);
		sprite.body.setAllowGravity(false);
		sprite.body.setImmovable(true);
		sprite.body.setSize(32, 32).setOffset(16, 16);
		sprite.play('portal-idle');
		sprite.setInteractive({ cursor: 'pointer' });
		sprite.on('pointerdown', () => this.enterPortal(sprite));
		sprite.on('pointerover', () => {
			sprite.setData('hover', true);
			sprite.setTint(0xffffff);
			this.updatePortalLabel(sprite);
		});
		sprite.on('pointerout', () => {
			sprite.setData('hover', false);
			this.updatePortalLabel(sprite);
		});

		const label = this.add
			.text(portal.x, portal.y - 28, portal.title, {
				fontFamily: '"IBM Plex Mono", monospace',
				fontSize: '9px',
				color: '#f7e9ff',
				padding: { x: 6, y: 3 },
			})
			.setOrigin(0.5)
			.setAlpha(0)
			.setDepth(3);

		const labelBounds = label.getBounds();
		const labelBg = this.add.graphics().setDepth(2.9);
		labelBg.fillStyle(0x12081f, 0.85);
		labelBg.lineStyle(1, 0x8b63c9, 0.9);
		labelBg.fillRoundedRect(
			labelBounds.x - 4,
			labelBounds.y - 2,
			labelBounds.width + 8,
			labelBounds.height + 4,
			6,
		);
		labelBg.strokeRoundedRect(
			labelBounds.x - 4,
			labelBounds.y - 2,
			labelBounds.width + 8,
			labelBounds.height + 4,
			6,
		);

		label.setVisible(false);
		labelBg.setVisible(false);

		sprite.setData('label', label);
		sprite.setData('labelBg', labelBg);

		this.tweens.add({
			targets: sprite,
			scale: { from: 0.5, to: 0.54 },
			yoyo: true,
			repeat: -1,
			duration: 900,
			ease: 'Sine.easeInOut',
		});

		this.physics.add.overlap(this.player, sprite, () => this.enterPortal(sprite));

		return sprite;
	}

	private shootProjectile() {
		const speed = 160;
		const velocity = new Phaser.Math.Vector2(0, 0);
		switch (this.lastDirection) {
			case 'left':
				velocity.set(-speed, 0);
				break;
			case 'right':
				velocity.set(speed, 0);
				break;
			case 'up':
				velocity.set(0, -speed);
				break;
			default:
				velocity.set(0, speed);
				break;
		}
		const projectile = this.projectiles
			.create(this.player.x, this.player.y - 2, 'fireball', 0)
			.setDepth(2.5);

		if (!projectile) {
			return;
		}

		projectile.setVelocity(velocity.x, velocity.y);
		projectile.body.setSize(10, 10).setOffset(3, 3);
		projectile.setRotation(Phaser.Math.Angle.Between(0, 0, velocity.x, velocity.y));
		projectile.play('fireball-loop');

		this.time.delayedCall(1400, () => {
			if (projectile.active) {
				projectile.destroy();
			}
		});
	}

	private getPortalsFromMap(map: Phaser.Tilemaps.Tilemap): PortalConfig[] {
		const portalLayer = map.getObjectLayer('Portals');
		if (!portalLayer) {
			return [];
		}

		return portalLayer.objects
			.filter((object) => object.type === 'portal' || object.name)
			.map((object, index) => {
				const width = object.width ?? this.tileSize;
				const height = object.height ?? this.tileSize;
				const x = (object.x ?? 0) + width / 2;
				const y = (object.y ?? 0) + height / 2;
				const title =
					object.properties?.find((prop) => prop.name === 'title')?.value ??
					object.name ??
					`Portal ${index + 1}`;
				const url =
					object.properties?.find((prop) => prop.name === 'url')?.value ??
					'';
				return {
					id: object.name || `portal-${index + 1}`,
					title: String(title),
					url: String(url),
					x,
					y,
				};
			});
	}

	private fitCameraToMap(roomWidth: number, roomHeight: number) {
		const scaleX = this.scale.width / roomWidth;
		const scaleY = this.scale.height / roomHeight;
		this.cameras.main.setZoom(Math.min(scaleX, scaleY));
	}

	private createDecor(map: Phaser.Tilemaps.Tilemap) {
		const decorLayer = map.getObjectLayer('Decor');
		if (!decorLayer) {
			return;
		}

		const sheetDecor: Record<
			string,
			{ key: string; frames: number[]; offsets: { x: number; y: number }[]; depth?: number }
		> = {
			'cf-angel-statue': {
				key: 'cute-dungeon-objects',
				frames: [36, 37, 38, 45, 46, 47],
				offsets: [
					{ x: -16, y: -8 },
					{ x: 0, y: -8 },
					{ x: 16, y: -8 },
					{ x: -16, y: 8 },
					{ x: 0, y: 8 },
					{ x: 16, y: 8 },
				],
				depth: 2.1,
			},
			'cf-arch-small-2': {
				key: 'cute-arch-small',
				frames: [1, 8],
				offsets: [
					{ x: 0, y: -8 },
					{ x: 0, y: 8 },
				],
			},
			'cf-web-1': {
				key: 'cute-dungeon-objects',
				frames: [7, 16],
				offsets: [
					{ x: 0, y: -8 },
					{ x: 0, y: 8 },
				],
			},
			'cf-web-2': {
				key: 'cute-dungeon-objects',
				frames: [25, 34],
				offsets: [
					{ x: 0, y: -8 },
					{ x: 0, y: 8 },
				],
			},
			'cf-crate-stack': {
				key: 'cute-dungeon-objects',
				frames: [0, 9],
				offsets: [
					{ x: 0, y: -8 },
					{ x: 0, y: 8 },
				],
			},
			'cf-chest': {
				key: 'cute-dungeon-objects',
				frames: [30, 31],
				offsets: [
					{ x: -8, y: 0 },
					{ x: 8, y: 0 },
				],
			},
			'cf-pot-orange-sm': {
				key: 'cute-dungeon-objects',
				frames: [23],
				offsets: [{ x: 0, y: 0 }],
			},
			'cf-pot-grey-sm': {
				key: 'cute-dungeon-objects',
				frames: [50],
				offsets: [{ x: 0, y: 0 }],
			},
			'cf-bones': {
				key: 'cute-dungeon-objects',
				frames: [13],
				offsets: [{ x: 0, y: 0 }],
			},
			'cf-torch-pink': {
				key: 'cute-arch-small',
				frames: [5, 12, 19, 26],
				offsets: [
					{ x: 0, y: -24 },
					{ x: 0, y: -8 },
					{ x: 0, y: 8 },
					{ x: 0, y: 24 },
				],
			},
			'cf-torch-blue': {
				key: 'cute-arch-small',
				frames: [6, 13, 20, 27],
				offsets: [
					{ x: 0, y: -24 },
					{ x: 0, y: -8 },
					{ x: 0, y: 8 },
					{ x: 0, y: 24 },
				],
			},
			'cf-pillar': {
				key: 'cute-pillars',
				frames: [0, 3, 6],
				offsets: [
					{ x: 0, y: -16 },
					{ x: 0, y: 0 },
					{ x: 0, y: 16 },
				],
			},
		};

		decorLayer.objects.forEach((object) => {
			const key = object.name;
			if (!key) {
				return;
			}
			const width = object.width ?? this.tileSize;
			const height = object.height ?? this.tileSize;
			const x = (object.x ?? 0) + width / 2;
			const y = (object.y ?? 0) + height / 2;

			if (key.startsWith('cf-spike-')) {
				const frame = Number(key.split('-').pop() ?? 0);
				this.add.sprite(x, y, 'cute-floor-spikes', frame).setDepth(1.4);
				this.addDecorCollider(x, y, width, height);
				return;
			}

			const sheet = sheetDecor[key];
			if (sheet) {
				const placedSprites: Phaser.GameObjects.Sprite[] = [];
				sheet.frames.forEach((frame, i) => {
					const offset = sheet.offsets[i] ?? { x: 0, y: 0 };
					const sprite = this.add
						.sprite(x + offset.x, y + offset.y, sheet.key, frame)
						.setDepth(sheet.depth ?? 1.5);
					placedSprites.push(sprite);
				});
				if (key === 'cf-torch-pink' || key === 'cf-torch-blue') {
					// Bottom 32px is reflection; collision only on top 32px.
					this.addDecorCollider(x, y - 16, width, height - 32);
				} else if (key === 'cf-angel-statue') {
					// Keep collision tight to the statue body, not the wings.
					this.addDecorCollider(x, y + 4, 20, 24);
					const hitbox = this.add.rectangle(x, y, width, height, 0x000000, 0);
					hitbox.setDepth(3);
					hitbox.setInteractive({ cursor: 'pointer' });
					hitbox.on('pointerdown', () => {
						window.open('https://x.com/calicomccoy', '_blank', 'noopener');
					});
					const tooltip = this.add
						.text(x, y - 28, 'X.com', {
							fontFamily: '"IBM Plex Mono", monospace',
							fontSize: '9px',
							color: '#d9fff2',
							padding: { x: 6, y: 3 },
						})
						.setOrigin(0.5)
						.setAlpha(0)
						.setDepth(3.5);
					const tipBounds = tooltip.getBounds();
					const tipBg = this.add.graphics().setDepth(3.4);
					tipBg.fillStyle(0x0b1a15, 0.85);
					tipBg.lineStyle(1, 0x77fff0, 0.85);
					tipBg.fillRoundedRect(
						tipBounds.x - 4,
						tipBounds.y - 2,
						tipBounds.width + 8,
						tipBounds.height + 4,
						6,
					);
					tipBg.strokeRoundedRect(
						tipBounds.x - 4,
						tipBounds.y - 2,
						tipBounds.width + 8,
						tipBounds.height + 4,
						6,
					);
					tooltip.setVisible(false);
					tipBg.setVisible(false);
					hitbox.on('pointerover', () => {
						placedSprites.forEach((sprite) => sprite.setTint(0x77fff0));
						tooltip.setVisible(true);
						tipBg.setVisible(true);
						tooltip.setAlpha(1);
						tipBg.setAlpha(1);
					});
					hitbox.on('pointerout', () => {
						placedSprites.forEach((sprite) => sprite.clearTint());
						tooltip.setVisible(false);
						tipBg.setVisible(false);
						tooltip.setAlpha(0);
						tipBg.setAlpha(0);
					});
				} else if (key === 'cf-pillar') {
					// Only block the base so the player can pass behind the column.
					this.addDecorCollider(x, y + 16, width, 16);
				} else {
					this.addDecorCollider(x, y, width, height);
				}
				return;
			}

			// Handle angel-statue specially (48x32 from dungeon-objects spritesheet)
			if (key === 'angel-statue') {
				// Angel statue is 3x2 tiles at col 0-2, rows 4-5
				// Tileset is 9 columns wide
				const frames = [36, 37, 38, 45, 46, 47];
				const offsets = [
					{ x: -16, y: -8 },  // top-left
					{ x: 0, y: -8 },    // top-center
					{ x: 16, y: -8 },   // top-right
					{ x: -16, y: 8 },   // bottom-left
					{ x: 0, y: 8 },     // bottom-center
					{ x: 16, y: 8 },    // bottom-right
				];
				frames.forEach((frame, i) => {
					this.add.sprite(x + offsets[i].x, y + offsets[i].y, 'dungeon-objects', frame).setDepth(1.5);
				});
				this.addDecorCollider(x, y, width, height);
				return;
			}

			const sprite = this.add.image(x, y, key).setDepth(1.5);
			const flicker = object.properties?.find((prop) => prop.name === 'flicker')?.value;
			if (flicker) {
				this.tweens.add({
					targets: sprite,
					alpha: { from: 0.75, to: 1 },
					duration: 900,
					yoyo: true,
					repeat: -1,
					ease: 'Sine.easeInOut',
				});
			}
			this.addDecorCollider(x, y, width, height);
		});
	}

	private addDecorCollider(x: number, y: number, width: number, height: number) {
		if (!this.decorHitboxes) {
			this.decorHitboxes = this.physics.add.staticGroup();
			this.physics.add.collider(this.player, this.decorHitboxes);
			this.physics.add.collider(this.projectiles, this.decorHitboxes, (projectile) => {
				projectile.destroy();
			});
		}
		const hitbox = this.add.rectangle(x, y, width, height, 0x000000, 0);
		this.physics.add.existing(hitbox, true);
		this.decorHitboxes.add(hitbox);
	}

	private updatePortalProximity() {
		this.portalSprites.forEach((portal) => {
			const distance = Phaser.Math.Distance.Between(
				this.player.x,
				this.player.y,
				portal.x,
				portal.y,
			);
			const near = distance <= PROXIMITY_RADIUS;
			portal.setData('near', near);
			const hover = Boolean(portal.getData('hover'));
			portal.setTint(near || hover ? 0xffffff : 0xb68cff);
			this.updatePortalLabel(portal);
		});
	}

	private updatePortalLabel(portal: Phaser.Physics.Arcade.Sprite) {
		const label = portal.getData('label') as Phaser.GameObjects.Text | undefined;
		const labelBg = portal.getData('labelBg') as Phaser.GameObjects.Graphics | undefined;
		if (!label || !labelBg) {
			return;
		}
		const placeRight = portal.x < ROOM_WIDTH / 2;
		const offsetX = placeRight ? 36 : -36;
		const offsetY = -6;
		label.setOrigin(placeRight ? 0 : 1, 0.5);
		label.setPosition(portal.x + offsetX, portal.y + offsetY);
		const labelBounds = label.getBounds();
		labelBg.clear();
		labelBg.fillStyle(0x12081f, 0.85);
		labelBg.lineStyle(1, 0x8b63c9, 0.9);
		labelBg.fillRoundedRect(
			labelBounds.x - 4,
			labelBounds.y - 2,
			labelBounds.width + 8,
			labelBounds.height + 4,
			6,
		);
		labelBg.strokeRoundedRect(
			labelBounds.x - 4,
			labelBounds.y - 2,
			labelBounds.width + 8,
			labelBounds.height + 4,
			6,
		);
		const near = Boolean(portal.getData('near'));
		const hover = Boolean(portal.getData('hover'));
		const show = near || hover;
		label.setVisible(show);
		labelBg.setVisible(show);
		label.setAlpha(show ? 1 : 0);
		labelBg.setAlpha(show ? 1 : 0);
	}

	private setIdleFrame() {
		this.player.setFrame(0);
		this.player.setFlipX(this.lastDirection === 'left');
	}

	private playWalkAnimation() {
		this.player.setFlipX(this.lastDirection === 'left');
		this.player.anims.play('walk', true);
	}

	private enterPortal(portal: Phaser.Physics.Arcade.Sprite) {
		if (this.entering) {
			return;
		}
		this.entering = true;
		this.input.keyboard.enabled = false;
		this.player.setVelocity(0, 0);
		const burst = this.add
			.sprite(portal.x, portal.y, 'portal', 0)
			.setDepth(6)
			.setScale(0.6)
			.setAlpha(0.95);
		burst.play('portal-burst');
		this.tweens.add({
			targets: burst,
			scale: { from: 0.6, to: 0.9 },
			alpha: { from: 0.95, to: 0 },
			duration: 420,
			ease: 'Quad.easeOut',
		});
		burst.on(Phaser.Animations.Events.ANIMATION_COMPLETE, () => burst.destroy());

		this.time.delayedCall(320, () => {
			this.cameras.main.fadeOut(260, 0, 0, 0);
			this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
				const data = portal.getData('portal') as PortalConfig;
				window.location.assign(resolveUrl(data.url));
			});
		});
	}
}

let game: Phaser.Game | null = null;

export const launchDungeon = () => {
	if (game) {
		game.destroy(true);
	}
	game = new Phaser.Game({
		type: Phaser.AUTO,
		width: ROOM_WIDTH,
		height: ROOM_HEIGHT,
		parent: 'game-root',
		pixelArt: true,
		roundPixels: true,
		backgroundColor: '#05020a',
		physics: {
			default: 'arcade',
			arcade: {
				gravity: { y: 0 },
				debug: false,
			},
		},
		scale: {
			mode: Phaser.Scale.FIT,
			autoCenter: Phaser.Scale.CENTER_BOTH,
		},
		scene: [DungeonScene],
	});
	if (typeof window !== 'undefined') {
		window.__PHASER_GAME__ = game;
	}
};

const autoStart = () => {
	if (typeof document === 'undefined') {
		return;
	}
	const root = document.getElementById('game-root');
	if (!root) {
		return;
	}
	if (shadersEnabled) {
		setupShaderOverlay();
	}
	launchDungeon();
};

const setupShaderOverlay = () => {
	if (document.getElementById('shader-overlay')) {
		return;
	}
	const overlay = document.createElement('div');
	overlay.id = 'shader-overlay';
	const glimmer = document.createElement('div');
	glimmer.className = 'shader-glimmer';
	overlay.appendChild(glimmer);
	document.body.appendChild(overlay);

	let targetX = 0.5;
	let targetY = 0.5;
	let currentX = 0.5;
	let currentY = 0.5;

	const update = () => {
		currentX += (targetX - currentX) * 0.08;
		currentY += (targetY - currentY) * 0.08;
		overlay.style.setProperty('--cursor-x', `${currentX * 100}%`);
		overlay.style.setProperty('--cursor-y', `${currentY * 100}%`);
		requestAnimationFrame(update);
	};

	window.addEventListener('mousemove', (event) => {
		targetX = event.clientX / window.innerWidth;
		targetY = event.clientY / window.innerHeight;
	});
	update();
};

if (typeof window !== 'undefined') {
	if (document.readyState === 'loading') {
		window.addEventListener('DOMContentLoaded', autoStart, { once: true });
	} else {
		autoStart();
	}
}

if (import.meta.hot) {
	import.meta.hot.dispose(() => {
		if (game) {
			game.destroy(true);
			game = null;
		}
	});
}
