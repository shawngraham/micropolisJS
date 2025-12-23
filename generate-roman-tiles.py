#!/usr/bin/env python3
"""
Generate a Roman-themed tileset for micropolisJS
Converts modern city tiles to ancient Roman aesthetic
"""

from PIL import Image, ImageDraw
import random

# Tile specifications
TILE_SIZE = 16
TILES_PER_ROW = 32
IMAGE_SIZE = 512

# Roman/Mediterranean color palette
ROMAN_COLORS = {
    'stone': [(200, 190, 170), (210, 200, 180), (190, 180, 160), (180, 170, 150)],
    'terracotta': [(180, 100, 70), (190, 110, 80), (170, 90, 60), (200, 120, 90)],
    'marble': [(240, 235, 225), (235, 230, 220), (245, 240, 230)],
    'road': [(160, 150, 140), (170, 160, 150), (150, 140, 130)],
    'aqueduct': [(220, 210, 195), (210, 200, 185), (230, 220, 205)],
    'water': [(100, 150, 200), (90, 140, 190), (110, 160, 210)],
    'green': [(100, 140, 80), (90, 130, 70), (110, 150, 90)],
    'brown_earth': [(140, 110, 80), (150, 120, 90), (130, 100, 70)],
}

def create_stone_texture(draw, x, y, width, height, color_set='stone'):
    """Create a simple stone texture"""
    colors = ROMAN_COLORS[color_set]
    base_color = random.choice(colors)
    draw.rectangle([x, y, x + width - 1, y + height - 1], fill=base_color)

    # Add texture
    for i in range(width * height // 8):
        px = x + random.randint(0, width - 1)
        py = y + random.randint(0, height - 1)
        shade = random.choice(colors)
        draw.point((px, py), fill=shade)

def draw_roman_building(draw, x, y, size=16, building_type='insula'):
    """Draw a simple Roman building"""
    if building_type == 'insula':
        # Multi-story tenement - terracotta with stone base
        # Stone base (2 pixels)
        draw.rectangle([x, y + size - 2, x + size - 1, y + size - 1],
                      fill=random.choice(ROMAN_COLORS['stone']))
        # Terracotta walls
        for floor in range(0, size - 2, 3):
            color = random.choice(ROMAN_COLORS['terracotta'])
            draw.rectangle([x, y + floor, x + size - 1, y + floor + 2], fill=color)
            # Windows (dark spots)
            if floor > 0:
                for window in range(2, size - 2, 4):
                    draw.point((x + window, y + floor + 1), fill=(60, 40, 30))

    elif building_type == 'domus':
        # Elite townhouse - marble/stone
        create_stone_texture(draw, x, y, size, size, 'marble')
        # Columns (simple white lines)
        draw.line([(x + 2, y), (x + 2, y + size - 1)], fill=(255, 255, 255))
        draw.line([(x + size - 3, y), (x + size - 3, y + size - 1)], fill=(255, 255, 255))

    elif building_type == 'market':
        # Taberna/market - open front
        create_stone_texture(draw, x, y, size, size, 'stone')
        # Open archway
        draw.rectangle([x + 2, y + size - 6, x + size - 3, y + size - 1], fill=(80, 70, 60))
        # Awning
        draw.rectangle([x, y, x + size - 1, y + 2], fill=random.choice(ROMAN_COLORS['terracotta']))

    elif building_type == 'workshop':
        # Officina - stone with chimney
        create_stone_texture(draw, x, y, size, size, 'brown_earth')
        # Smoke/chimney indicator
        for i in range(3):
            draw.point((x + size - 3, y + i), fill=(100, 100, 100))

def draw_aqueduct_tile(draw, x, y, size=16, arch_type='straight'):
    """Draw aqueduct tiles"""
    stone = random.choice(ROMAN_COLORS['aqueduct'])

    if arch_type == 'straight':
        # Horizontal aqueduct with arches
        # Top channel
        draw.rectangle([x, y, x + size - 1, y + 3], fill=stone)
        # Pillars
        draw.rectangle([x + 1, y + 3, x + 3, y + size - 1], fill=stone)
        draw.rectangle([x + size - 4, y + 3, x + size - 2, y + size - 1], fill=stone)
        # Arch
        for i in range(4, 12):
            if i < 8:
                draw.point((x + i, y + 4 + (8 - i) // 2), fill=stone)

    elif arch_type == 'tower':
        # Water tower / castellum
        draw.rectangle([x, y, x + size - 1, y + size - 1], fill=stone)
        # Water at top
        draw.rectangle([x + 2, y + 1, x + size - 3, y + 3],
                      fill=random.choice(ROMAN_COLORS['water']))
        # Arched openings
        for i in range(4, size, 6):
            draw.rectangle([x + 2, y + i, x + size - 3, y + i + 2], fill=(80, 70, 60))

def draw_roman_road(draw, x, y, size=16, road_type='straight'):
    """Draw Roman stone-paved roads"""
    # Base stone road color
    base = random.choice(ROMAN_COLORS['road'])
    draw.rectangle([x, y, x + size - 1, y + size - 1], fill=base)

    # Add stone pattern
    for i in range(0, size, 4):
        for j in range(0, size, 4):
            if random.random() > 0.5:
                shade = (base[0] + random.randint(-10, 10),
                        base[1] + random.randint(-10, 10),
                        base[2] + random.randint(-10, 10))
                shade = tuple(max(0, min(255, c)) for c in shade)
                draw.rectangle([x + i, y + j, x + i + 3, y + j + 3], fill=shade)

def modify_to_roman_palette(img):
    """Adjust overall image to Mediterranean palette"""
    pixels = img.load()
    width, height = img.size

    for y in range(height):
        for x in range(width):
            r, g, b, a = pixels[x, y]

            # Skip transparent pixels
            if a < 10:
                continue

            # Warm up blues (less modern/cold)
            if b > r + 20 and b > g + 20:
                # It's blue - make it warmer or keep as water
                if b > 150:  # Bright blue - probably water
                    pixels[x, y] = random.choice(ROMAN_COLORS['water']) + (a,)
                else:
                    # Darken blues
                    pixels[x, y] = (r + 10, g + 10, b - 20, a)

            # Adjust greens to Mediterranean vegetation
            elif g > r + 10 and g > b + 10:
                # It's green
                if g > 100:
                    pixels[x, y] = random.choice(ROMAN_COLORS['green']) + (a,)

            # Convert bright modern colors to earth tones
            elif r > 200 and g < 100 and b < 100:
                # Bright red - make terracotta
                pixels[x, y] = random.choice(ROMAN_COLORS['terracotta']) + (a,)

            # Gray/black for roads - make stone
            elif abs(r - g) < 20 and abs(g - b) < 20 and r < 150:
                if random.random() > 0.7:
                    pixels[x, y] = random.choice(ROMAN_COLORS['road']) + (a,)

    return img

def generate_roman_tileset(input_path, output_path):
    """Generate Roman-themed tileset from original"""
    print(f"Loading original tileset from {input_path}...")
    img = Image.open(input_path).convert('RGBA')

    print("Applying Roman color palette...")
    img = modify_to_roman_palette(img)

    draw = ImageDraw.Draw(img)

    print("Drawing Roman architectural elements...")

    # Key tile positions (approximate - based on common tileset layouts)
    # Note: This is a simplified version. A full conversion would require
    # mapping each of the 1024 tiles individually.

    # Residential zones (rows 0-4, approximately)
    random.seed(42)  # For consistency
    for row in range(0, 5):
        for col in range(0, 20):
            x = col * TILE_SIZE
            y = row * TILE_SIZE
            if random.random() > 0.3:  # Don't replace everything
                building_type = random.choice(['insula', 'domus', 'market'])
                draw_roman_building(draw, x, y, TILE_SIZE, building_type)

    # Commercial zones (rows 5-8, approximately)
    for row in range(5, 9):
        for col in range(0, 20):
            x = col * TILE_SIZE
            y = row * TILE_SIZE
            if random.random() > 0.3:
                draw_roman_building(draw, x, y, TILE_SIZE, 'market')

    # Industrial/workshop zones (rows 9-12)
    for row in range(9, 13):
        for col in range(0, 20):
            x = col * TILE_SIZE
            y = row * TILE_SIZE
            if random.random() > 0.3:
                draw_roman_building(draw, x, y, TILE_SIZE, 'workshop')

    # Roads (sample positions)
    for row in range(20, 23):
        for col in range(0, 32):
            x = col * TILE_SIZE
            y = row * TILE_SIZE
            draw_roman_road(draw, x, y, TILE_SIZE)

    # Aqueducts replacing power lines (rows 23-26)
    for row in range(23, 27):
        for col in range(0, 32):
            x = col * TILE_SIZE
            y = row * TILE_SIZE
            if col % 3 == 0:
                draw_aqueduct_tile(draw, x, y, TILE_SIZE, 'tower')
            else:
                draw_aqueduct_tile(draw, x, y, TILE_SIZE, 'straight')

    print(f"Saving Roman tileset to {output_path}...")
    img.save(output_path)
    print("Done! Roman tileset generated successfully.")
    print(f"\nNote: This is a programmatically generated version with simplified")
    print(f"Roman architectural elements. For best results, consider commissioning")
    print(f"a pixel artist to create detailed Roman buildings.")

if __name__ == '__main__':
    input_file = 'images/tiles.png'
    output_file = 'images/tiles-roman.png'
    generate_roman_tileset(input_file, output_file)
