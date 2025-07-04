"""add column

Revision ID: a2f846986659
Revises: c6fb3e2653aa
Create Date: 2025-06-17 20:07:41.123288

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'a2f846986659'
down_revision: Union[str, None] = 'c6fb3e2653aa'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('incentives', sa.Column('claimed', sa.Boolean(), nullable=True))
    # ### end Alembic commands ###


def downgrade() -> None:
    """Downgrade schema."""
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('incentives', 'claimed')
    # ### end Alembic commands ###
