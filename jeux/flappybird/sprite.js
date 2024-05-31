var 
s_bird,
s_bg,
s_fg,
s_pipeNorth,
s_pipeSouth,
s_text,
s_score,
s_splash,
s_buttons,
s_numberS,
s_numberB,
s_cliff;


function Sprite(img) {
	this.img = img;
	this.height = img.height;
	this.width = img.width;
};
Sprite.prototype.draw = function(ctx, x, y) {
	ctx.drawImage(this.img, x, y);
};

async function initSprites() {

	s_bird = [
		new Sprite(await getImageWithAvailableExtension("img/bird0")),
		new Sprite(await getImageWithAvailableExtension("img/bird1")),
		new Sprite(await getImageWithAvailableExtension("img/bird2"))
	];
	
	s_bg = new Sprite(await getImageWithAvailableExtension("img/background"));
	s_fg = new Sprite(await getImageWithAvailableExtension("img/foreground"));
	
	s_pipeNorth = new Sprite(await getImageWithAvailableExtension("img/pipeTop"));
	s_pipeSouth = new Sprite(await getImageWithAvailableExtension("img/pipeBottom"));
	
	s_text = {
		GetReady:   new Sprite(await getImageWithAvailableExtension("img/textGetReady")),
	}

	s_splash = new Sprite(await getImageWithAvailableExtension("img/tap"));

	s_cliff = new Sprite(await getImageWithAvailableExtension("img/cliff"));
}