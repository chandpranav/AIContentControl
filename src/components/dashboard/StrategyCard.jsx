import React from 'react';
import { colors, spacing, borderRadius, shadows, typography } from '../../styles/theme';

/**
 * Individual Strategy Card component
 */
const StrategyCard = ({ section }) => {
    const styles = {
        card: {
            background: colors.background.primary,
            borderRadius: borderRadius.lg,
            padding: spacing.lg,
            boxShadow: shadows.md,
            display: 'flex',
            flexDirection: 'column',
        },
        title: {
            fontSize: typography.fontSize.lg,
            marginBottom: spacing.md,
            color: colors.text.primary,
            borderBottom: `1px solid rgba(120, 87, 255, 0.3)`,
            paddingBottom: spacing.sm,
            fontWeight: typography.fontWeight.semibold,
        },
        list: {
            listStyle: 'none',
            padding: 0,
            margin: 0,
        },
        listItem: {
            marginBottom: spacing.md,
            padding: spacing.md,
            borderRadius: borderRadius.md,
            backgroundColor: colors.background.card,
        },
        itemLabel: {
            fontWeight: typography.fontWeight.semibold,
            color: colors.primary.light,
            marginBottom: spacing.xs,
        },
        itemMeta: {
            fontSize: typography.fontSize.sm,
            color: colors.text.muted,
            marginBottom: spacing.xs,
        },
        itemDesc: {
            fontSize: typography.fontSize.sm,
            color: colors.text.secondary,
            lineHeight: typography.lineHeight.normal,
        },
    };

    if (!section || !section.items) {
        return null;
    }

    return (
        <div style={styles.card} className="card">
            <h3 style={styles.title} className="cardTitle">{section.name}</h3>
            <ul style={styles.list}>
                {section.items.map((item, idx) => (
                    <li key={idx} style={styles.listItem}>
                        <div style={styles.itemLabel}>{item.label}</div>
                        {item.meta && <div style={styles.itemMeta}>{item.meta}</div>}
                        {item.description && <div style={styles.itemDesc}>{item.description}</div>}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default StrategyCard;
