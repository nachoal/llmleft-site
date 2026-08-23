#!/usr/bin/env swift
import AppKit
import Foundation

let root = URL(fileURLWithPath: FileManager.default.currentDirectoryPath)
let publicDirectory = root.appendingPathComponent("public", isDirectory: true)
let iconURL = publicDirectory.appendingPathComponent("favicon.svg")

guard let icon = NSImage(contentsOf: iconURL) else {
    fputs("Could not load public/favicon.svg\n", stderr)
    exit(1)
}

func color(_ hex: UInt32) -> NSColor {
    NSColor(
        red: CGFloat((hex >> 16) & 0xff) / 255,
        green: CGFloat((hex >> 8) & 0xff) / 255,
        blue: CGFloat(hex & 0xff) / 255,
        alpha: 1
    )
}

func writePNG(name: String, width: Int, height: Int, draw: () -> Void) {
    guard let bitmap = NSBitmapImageRep(
        bitmapDataPlanes: nil,
        pixelsWide: width,
        pixelsHigh: height,
        bitsPerSample: 8,
        samplesPerPixel: 4,
        hasAlpha: true,
        isPlanar: false,
        colorSpaceName: .deviceRGB,
        bytesPerRow: 0,
        bitsPerPixel: 0
    ) else {
        fputs("Could not create bitmap for \(name)\n", stderr)
        exit(1)
    }

    bitmap.size = NSSize(width: width, height: height)
    NSGraphicsContext.saveGraphicsState()
    NSGraphicsContext.current = NSGraphicsContext(bitmapImageRep: bitmap)
    NSGraphicsContext.current?.imageInterpolation = .high
    draw()
    NSGraphicsContext.restoreGraphicsState()

    guard let data = bitmap.representation(using: .png, properties: [:]) else {
        fputs("Could not encode \(name)\n", stderr)
        exit(1)
    }
    do {
        try data.write(to: publicDirectory.appendingPathComponent(name), options: .atomic)
        print("wrote public/\(name) (\(width)x\(height))")
    } catch {
        fputs("Could not write \(name): \(error)\n", stderr)
        exit(1)
    }
}

func drawIcon(size: CGFloat, x: CGFloat = 0, y: CGFloat = 0) {
    icon.draw(
        in: NSRect(x: x, y: y, width: size, height: size),
        from: .zero,
        operation: .sourceOver,
        fraction: 1,
        respectFlipped: true,
        hints: [.interpolation: NSImageInterpolation.high]
    )
}

for (name, size) in [
    ("favicon.png", 96),
    ("icon-64.png", 64),
    ("icon-192.png", 192),
    ("icon-512.png", 512),
    ("apple-touch-icon.png", 180),
] {
    writePNG(name: name, width: size, height: size) {
        drawIcon(size: CGFloat(size))
    }
}

writePNG(name: "og.png", width: 1200, height: 630) {
    color(0x050706).setFill()
    NSBezierPath(rect: NSRect(x: 0, y: 0, width: 1200, height: 630)).fill()

    color(0x00f56a).withAlphaComponent(0.10).setFill()
    NSBezierPath(ovalIn: NSRect(x: 650, y: -290, width: 820, height: 820)).fill()

    drawIcon(size: 176, x: 80, y: 373)

    let eyebrow = NSAttributedString(
        string: "CLAUDE + CODEX USAGE TRACKER",
        attributes: [
            .font: NSFont.systemFont(ofSize: 24, weight: .semibold),
            .foregroundColor: color(0x00f56a),
            .kern: 1.8,
        ]
    )
    eyebrow.draw(at: NSPoint(x: 80, y: 321))

    let paragraph = NSMutableParagraphStyle()
    paragraph.lineSpacing = -4
    let headline = NSAttributedString(
        string: "Know what you have left.",
        attributes: [
            .font: NSFont.systemFont(ofSize: 70, weight: .bold),
            .foregroundColor: NSColor.white,
            .paragraphStyle: paragraph,
            .kern: -2.6,
        ]
    )
    headline.draw(in: NSRect(x: 80, y: 185, width: 950, height: 96))

    let subtitle = NSAttributedString(
        string: "Mac menu bar, iPhone, and widgets. Credentials stay on your Mac.",
        attributes: [
            .font: NSFont.systemFont(ofSize: 27, weight: .regular),
            .foregroundColor: color(0xb8bdb9),
        ]
    )
    subtitle.draw(in: NSRect(x: 83, y: 112, width: 900, height: 44))

    let wordmark = NSAttributedString(
        string: "LLM LEFT",
        attributes: [
            .font: NSFont.systemFont(ofSize: 23, weight: .bold),
            .foregroundColor: NSColor.white,
            .kern: 1.3,
        ]
    )
    wordmark.draw(at: NSPoint(x: 966, y: 55))
}

