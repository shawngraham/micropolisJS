#!/usr/bin/env python3
"""
Reassemble tiles from a 512x512 composite image.

The input image (tiles.png) contains rows of 32x32 pixel tiles.
Every 9 sequential tiles are extracted and arranged into a 3x3 grid,
then saved as a separate PNG file.
"""

from PIL import Image
import os

def extract_tiles(image_path, tile_size=32):
    """Extract all tiles from the composite image in row-major order."""
    img = Image.open(image_path)
    width, height = img.size
    
    tiles_per_row = width // tile_size
    tiles_per_col = height // tile_size
    
    tiles = []
    for row in range(tiles_per_col):
        for col in range(tiles_per_row):
            left = col * tile_size
            top = row * tile_size
            right = left + tile_size
            bottom = top + tile_size
            
            tile = img.crop((left, top, right, bottom))
            tiles.append(tile)
    
    return tiles

def create_grid(tiles, grid_size=3, tile_size=32):
    """Arrange tiles into a grid_size x grid_size grid."""
    grid_img = Image.new('RGBA', (grid_size * tile_size, grid_size * tile_size))
    
    for i, tile in enumerate(tiles):
        row = i // grid_size
        col = i % grid_size
        x = col * tile_size
        y = row * tile_size
        grid_img.paste(tile, (x, y))
    
    return grid_img

def main():
    input_path = "tiles.png"
    output_dir = "output_grids"
    tile_size = 16
    grid_size = 3
    tiles_per_grid = grid_size * grid_size  # 9
    
    # Create output directory
    os.makedirs(output_dir, exist_ok=True)
    
    # Extract all tiles
    print(f"Loading {input_path}...")
    tiles = extract_tiles(input_path, tile_size)
    print(f"Extracted {len(tiles)} tiles")
    
    # Calculate number of complete grids
    num_grids = len(tiles) // tiles_per_grid
    print(f"Creating {num_grids} grids of {grid_size}x{grid_size} tiles")
    
    # Create and save each grid
    for grid_idx in range(num_grids):
        start_idx = grid_idx * tiles_per_grid
        end_idx = start_idx + tiles_per_grid
        grid_tiles = tiles[start_idx:end_idx]
        
        grid_img = create_grid(grid_tiles, grid_size, tile_size)
        output_path = os.path.join(output_dir, f"grid_{grid_idx:03d}.png")
        grid_img.save(output_path)
        print(f"Saved {output_path}")
    
    # Handle remaining tiles if any
    remaining = len(tiles) % tiles_per_grid
    if remaining > 0:
        print(f"Note: {remaining} tiles remaining (not enough for a complete grid)")
    
    print(f"\nDone! Created {num_grids} grid images in '{output_dir}/'")

if __name__ == "__main__":
    main()
