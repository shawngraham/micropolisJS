#grids -> tiles.png
#!/usr/bin/env python3
"""
Reassemble grid images back into a single composite tile sheet.

Takes a folder of 3x3 grid images (grid_000.png, grid_001.png, etc.)
and reconstructs the original tiles.png by extracting each 16x16 tile
and placing them sequentially into rows.
"""

from PIL import Image
import os
import glob

def extract_tiles_from_grid(grid_img, tile_size=16, grid_size=3):
    """Extract tiles from a grid image in row-major order."""
    tiles = []
    for row in range(grid_size):
        for col in range(grid_size):
            left = col * tile_size
            top = row * tile_size
            right = left + tile_size
            bottom = top + tile_size
            tile = grid_img.crop((left, top, right, bottom))
            tiles.append(tile)
    return tiles

def main():
    input_dir = "output_grids"
    output_path = "tiles_reconstructed.png"
    tile_size = 16
    grid_size = 3
    output_width = 512
    output_height = 512
    
    tiles_per_row = output_width // tile_size  # 32
    
    # Find all grid files and sort them
    grid_files = sorted(glob.glob(os.path.join(input_dir, "grid_*.png")))
    print(f"Found {len(grid_files)} grid files")
    
    # Extract all tiles from all grids
    all_tiles = []
    for grid_file in grid_files:
        grid_img = Image.open(grid_file)
        tiles = extract_tiles_from_grid(grid_img, tile_size, grid_size)
        all_tiles.extend(tiles)
        print(f"Extracted 9 tiles from {os.path.basename(grid_file)}")
    
    print(f"\nTotal tiles extracted: {len(all_tiles)}")
    
    # Create output image
    output_img = Image.new('RGBA', (output_width, output_height))
    
    # Place tiles into output image
    for i, tile in enumerate(all_tiles):
        if i >= tiles_per_row * (output_height // tile_size):
            print(f"Warning: More tiles than fit in output image, stopping at {i}")
            break
        
        row = i // tiles_per_row
        col = i % tiles_per_row
        x = col * tile_size
        y = row * tile_size
        output_img.paste(tile, (x, y))
    
    output_img.save(output_path)
    print(f"\nSaved reconstructed image to {output_path}")

if __name__ == "__main__":
    main()
